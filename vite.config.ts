import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: "none",
      themeName: process.env.COMPANY ?? "automining",
      kcContextExclusionsFtl: [
        '<@addToXKeycloakifyMessagesIfMessageKey str="welcomeMessage" />',
        '<@addToXKeycloakifyMessagesIfMessageKey str="appName" />',
        '<@addToXKeycloakifyMessagesIfMessageKey str="companyMotto" />',
        '<@addToXKeycloakifyMessagesIfMessageKey str="companyLogoName" />',
      ].join("\n")
    }),
  ]
});
