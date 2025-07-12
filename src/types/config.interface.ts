export interface AppConfig {
    jwt: JWTConfig;
    mail: MailConfig;
    port: string;
    flavour: string;
    log_path: string;
    database: DatabaseConfig;
    bcrypt_salt_round: string;
}

export interface JWTConfig {
    secret_key: string;
}

export interface MailConfig {
    port: string;
    email: string;
    server: string;
    password: string;
    templates: {
        update_password_template: string;
        send_email_verification_template: string;
    };
}

export interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    conn_pool: number;
    application_name: string;
}
