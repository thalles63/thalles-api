interface XboxTokenResponse {
    Token: string;
    DisplayClaims: {
        xui: Array<{
            uhs: string;
        }>;
    };
}
