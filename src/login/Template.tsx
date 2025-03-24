import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { msg, msgStr, advancedMsgStr, currentLanguage, enabledLanguages } = i18n;

  const { auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
  }, []);

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass")
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? kcClsx("kcBodyClass")
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className={clsx("flex", "w-full", "h-dvh")}>
      <div className={clsx("flex", "lg:w-1/2", "w-full", "items-center", "gap-1", "mt-4", "justify-center")}>
        <div className={clsx("flex", "flex-col", "justify-around")}>
          <div className={clsx("rounded-xl", "sm:shadow-md", "mx-5", "flex", "flex-col", "gap-2", "p-8", "bg-white")}>
            <div id="kc-header" className={kcClsx("kcHeaderClass")}>
              <img src={`${import.meta.env.BASE_URL}img/icons/${advancedMsgStr("companyLogoName")}.png`} width={32} className="m-1" />
            </div>
            <header className={kcClsx("kcFormHeaderClass")}>
              {enabledLanguages.length > 1 && false && (
                <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                  <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                    <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                      <button
                        tabIndex={1}
                        id="kc-current-locale-link"
                        aria-label={msgStr("languages")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="language-switch1"
                      >
                        {currentLanguage.label}
                      </button>
                      <ul
                        role="menu"
                        tabIndex={-1}
                        aria-labelledby="kc-current-locale-link"
                        aria-activedescendant=""
                        id="language-switch1"
                        className={kcClsx("kcLocaleListClass")}
                      >
                        {enabledLanguages.map(({ languageTag, label, href }, i) => (
                          <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                            <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {(() => {
                const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                  <h1 id="kc-page-title" className={clsx("text-4xl", "font-bold")}>{headerNode}</h1>
                ) : (
                  <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                      <div className="kc-login-tooltip">
                        <i className={kcClsx("kcResetFlowIcon")}></i>
                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                      </div>
                    </a>
                  </div>
                );

                if (displayRequiredFields) {
                  return (
                    <div className={kcClsx("kcContentWrapperClass")}>
                      <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                        <span className="subtitle">
                          <span className="required">*</span>
                          {msg("requiredFields")}
                        </span>
                      </div>
                      <div className="col-md-10">{node}</div>
                    </div>
                  );
                }

                return node;
              })()}
            </header>
            <div id="kc-content" >
              <div id="kc-content-wrapper">
                {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                  <div
                    className={clsx(
                      `alert-${message.type}`,
                      kcClsx("kcAlertClass"),
                      `pf-m-${message?.type === "error" ? "danger" : message.type}`
                    )}
                  >
                    <div className="pf-c-alert__icon">
                      {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                      {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                      {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                      {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                    </div>
                    <span
                      className={kcClsx("kcAlertTitleClass")}
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(message.summary)
                      }}
                    />
                  </div>
                )}
                {children}
                {auth !== undefined && auth.showTryAnotherWayLink && (
                  <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                    <div className={kcClsx("kcFormGroupClass")}>
                      <input type="hidden" name="tryAnotherWay" value="on" />
                      <a
                        href="#"
                        id="try-another-way"
                        onClick={() => {
                          document.forms["kc-select-try-another-way-form" as never].submit();
                          return false;
                        }}
                      >
                        {msg("doTryAnotherWay")}
                      </a>
                    </div>
                  </form>
                )}
                {socialProvidersNode}
                {displayInfo && (
                  <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                    <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                      {infoNode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`relative max-lg:hidden flex items-center justify-center w-1/2 h-full p-16 lg:px-28 overflow-hidden bg-primary-900 dark:border-l w-1/2ˆ`} >
        <svg className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <g className="text-gray-700 opacity-25" fill="none" stroke="currentColor" stroke-width="100">
            <circle r="234" cx="196" cy="23"></circle>
            <circle r="234" cx="790" cy="491"></circle>
          </g>
        </svg>
        <svg className="absolute -top-16 -right-16 text-gray-700"
          viewBox="0 0 220 192" width="220" height="192" fill="none">
          <defs>
            <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
            </pattern>
          </defs>
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect>
        </svg>
        <div className="z-10 relative w-full max-w-2xl flex flex-col">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <span>{advancedMsgStr("welcomeMessage")}</span><br />
            <span className="text-secondary-500">{advancedMsgStr("appName")}</span>
          </div>
          <div className="mt-6 text-lg tracking-tight leading-6 text-gray-400">
            {advancedMsgStr("companyMotto")}
          </div>
        </div>
      </div>
    </div >
  );
}
