from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_key: str
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
