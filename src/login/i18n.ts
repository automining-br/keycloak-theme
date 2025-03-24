/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    "pt-BR": {
      "companyLogoName": "automining",
      "welcomeMessage": "Bem-vindo ao",
      "appName": "Autominig Login",
      "companyMotto": "Nossa missão é fazer uma diferença positiva, desenvolvendo recursos naturais para melhorar a vida das pessoas agora e para as gerações futuras.",
    }
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
