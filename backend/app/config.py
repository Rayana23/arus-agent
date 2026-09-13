from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")
    database_url: str = "sqlite:///./arus.db"
    openrouter_api_key: str | None = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "openai/gpt-4.1-mini"
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str | None = None
    gmail_allowed_senders: str = ""

    @property
    def allowed_senders(self) -> set[str]:
        return {value.strip().lower() for value in self.gmail_allowed_senders.split(",") if value.strip()}


settings = Settings()
