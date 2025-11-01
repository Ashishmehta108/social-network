from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data = super().validate(attrs)
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "password",
            "password2",
            "date_of_birth",
            "profile_picture",
        )
        extra_kwargs = {
            "email": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def validate_profile_picture(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:  # 2MB limit
                raise serializers.ValidationError(
                    "Profile picture size cannot exceed 2MB."
                )
            if not value.content_type.startswith("image/"):
                raise serializers.ValidationError("File must be an image.")
        return value

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(
        required=False, allow_null=True, use_url=False
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "full_name",
            "profile_picture",
            "date_of_birth",
        )

    def get_profile_picture(self, obj):
        print("Serializer method called for:", obj)
        if obj.profile_picture:
            return obj.profile_picture.name
        return None
