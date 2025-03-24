import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <div id="kc-registration-container">
          <div id="kc-registration">
            <span>
              {msg("noAccount")}{" "}
              <a tabIndex={8} href={url.registrationUrl}>
                {msg("doRegister")}
              </a>
            </span>
          </div>
        </div>
      }
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
              <div className={clsx("flex", "w-full", "items-center", "gap-1", "my-4")}>
                <div className={clsx("flex", "w-full", "border-t", "border-gray-200")} />
                <span className={clsx("flex", "text-nowrap")}>{msg("identity-provider-login-label")}</span>
                <div className={clsx("flex", "w-full", "border-t", "border-gray-200")} />
              </div>
              <ul>
                {social.providers.map((...[p, , _providers]) => (
                  <li key={p.alias}>
                    <a
                      href={p.loginUrl}
                      type="button"
                      style={{ textDecoration: 'none' }}
                    >
                      <button
                        id={`social-${p.alias}`}
                        className={clsx("flex",
                          "w-full",
                          "px-2",
                          "py-3",
                          "justify-center",
                          "items-center",
                          "gap-1",
                          "rounded-full",
                          "border",
                          "border-gray-200",
                          "hover:bg-gray-200",
                          "transition-all",
                        )
                        }
                      >
                        <div className={clsx("flex", "h-5",)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z" /><path fill="#f35325" d="M1 1h10v10H1z" /><path fill="#81bc06" d="M12 1h10v10H12z" /><path fill="#05a6f0" d="M1 12h10v10H1z" /><path fill="#ffba08" d="M12 12h10v10H12z" /></svg>
                        </div>
                        <span
                          className={clsx("leading-none",
                            "no-underline hover:no-underline group-hover:no-underline", "text-black")}
                          dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                        ></span>
                      </button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
              className={clsx("flex", "flex-col", "gap-4", "mt-4")}
            >
              {!usernameHidden && (
                <div className={kcClsx("kcFormGroupClass")}>
                  <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                    {!realm.loginWithEmailAllowed
                      ? msg("username")
                      : !realm.registrationEmailAsUsername
                        ? msg("usernameOrEmail")
                        : msg("email")}
                  </label>
                  <input
                    tabIndex={2}
                    id="username"
                    className={clsx("border", "border-gray-200", "rounded", "px-2", "py-1", "text-lg", "w-full")}
                    name="username"
                    defaultValue={login.username ?? ""}
                    type="text"
                    autoFocus
                    autoComplete="username"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                  />
                  {messagesPerField.existsError("username", "password") && (
                    <span
                      id="input-error"
                      className={kcClsx("kcInputErrorMessageClass")}
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                      }}
                    />
                  )}
                </div>
              )}

              <div className={kcClsx("kcFormGroupClass")}>
                <label htmlFor="password" className={clsx(kcClsx("kcLabelClass"))}>
                  {msg("password")}
                </label>
                <input
                  tabIndex={3}
                  id="password"
                  className={clsx("border", "border-gray-200", "rounded", "px-2", "py-1", "text-lg", "w-full")}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={messagesPerField.existsError("username", "password")}
                />
                {usernameHidden && messagesPerField.existsError("username", "password") && (
                  <span
                    id="input-error"
                    className={kcClsx("kcInputErrorMessageClass")}
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                    }}
                  />
                )}
              </div>

              <div className={clsx("flex", "justify-between")}>
                <div id="kc-form-options">
                  {realm.rememberMe && !usernameHidden && (
                    <div className="checkbox">
                      <label>
                        <input
                          tabIndex={5}
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          defaultChecked={!!login.rememberMe}
                        />{" "}
                        {msg("rememberMe")}
                      </label>
                    </div>
                  )}
                </div>
                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                  {realm.resetPasswordAllowed && (
                    <span>
                      <a tabIndex={6} href={url.loginResetCredentialsUrl} className={clsx("text-primary-600", "hover:underline")}>
                        {msg("doForgotPassword")}
                      </a>
                    </span>
                  )}
                </div>
              </div>

              <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                <button
                  tabIndex={7}
                  disabled={isLoginButtonDisabled}
                  className={clsx("flex",
                    "w-full",
                    "px-2",
                    "py-3",
                    "justify-center",
                    "items-center",
                    "gap-1",
                    "rounded-full",
                    "bg-secondary-500",
                    "hover:brightness-80",
                    "transition-all",
                  )}
                  name="login"
                  id="kc-login"
                  type="submit"
                >
                  <span className={"text-white"}>{msgStr("doLogIn")}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template >
  );
}
