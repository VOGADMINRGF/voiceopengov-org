import type { SupportedLocale } from "@/config/locales";
import { getMemberAccountStrings } from "@/app/memberAccountStrings";

type CommunityOverride = {
  join: string;
  loginIntro: string;
  noMember: string;
  accountEyebrow: string;
  unauthenticated: string;
  active: string;
  statusBody: string;
  toCommunity: string;
  passwordEyebrow: string;
  setupIntro: string;
  setIntro: string;
  emailLabel: string;
  genericSent: string;
};

const OVERRIDES: Record<SupportedLocale, CommunityOverride> = {
  de: {
    join: "Community beitreten",
    loginIntro: "Der Login ist für bestätigte Community-Zugänge verfügbar.",
    noMember: "Noch nicht Teil der Community?",
    accountEyebrow: "Community-Konto",
    unauthenticated: "Bitte melde dich an, um deinen Community-Status zu sehen.",
    active: "Community bestätigt",
    statusBody: "Account und Community-Zugehörigkeit bleiben technisch getrennt. Dieser Status stammt aus dem bestätigten Community-Datensatz.",
    toCommunity: "Zur Community",
    passwordEyebrow: "Community-Zugang",
    setupIntro: "Das funktioniert auch für Community-Anmeldungen, die schon vor dem neuen Login bestätigt wurden.",
    setIntro: "Lege ein neues Passwort für deinen bestätigten Community-Zugang fest.",
    emailLabel: "E-Mail deiner Community-Anmeldung",
    genericSent: "Wenn eine bestätigte Community-Anmeldung zu dieser E-Mail besteht, haben wir dir einen Link zum Einrichten des Passworts geschickt.",
  },
  en: {
    join: "Join the community",
    loginIntro: "Sign-in is available for confirmed community access.",
    noMember: "Not part of the community yet?",
    accountEyebrow: "Community account",
    unauthenticated: "Please sign in to view your community status.",
    active: "Community confirmed",
    statusBody: "Account access and community affiliation remain technically separate. This status comes from the confirmed community record.",
    toCommunity: "Go to the community",
    passwordEyebrow: "Community access",
    setupIntro: "This also works for community registrations confirmed before the new sign-in was introduced.",
    setIntro: "Set a new password for your confirmed community access.",
    emailLabel: "Community registration email",
    genericSent: "If a confirmed community registration exists for this email, we sent a link to set up the password.",
  },
  fr: {
    join: "Rejoindre la communauté",
    loginIntro: "La connexion est disponible pour les accès communautaires confirmés.",
    noMember: "Pas encore dans la communauté ?",
    accountEyebrow: "Compte communautaire",
    unauthenticated: "Veuillez vous connecter pour voir votre statut dans la communauté.",
    active: "Communauté confirmée",
    statusBody: "L’accès au compte et l’appartenance à la communauté restent techniquement séparés. Ce statut provient du dossier communautaire confirmé.",
    toCommunity: "Vers la communauté",
    passwordEyebrow: "Accès communautaire",
    setupIntro: "Cela fonctionne aussi pour les inscriptions à la communauté confirmées avant l’introduction de la nouvelle connexion.",
    setIntro: "Définissez un nouveau mot de passe pour votre accès communautaire confirmé.",
    emailLabel: "E-mail de l’inscription à la communauté",
    genericSent: "Si une inscription confirmée à la communauté existe pour cet e-mail, nous avons envoyé un lien pour définir le mot de passe.",
  },
  es: {
    join: "Unirse a la comunidad",
    loginIntro: "El inicio de sesión está disponible para accesos comunitarios confirmados.",
    noMember: "¿Aún no formas parte de la comunidad?",
    accountEyebrow: "Cuenta de la comunidad",
    unauthenticated: "Inicia sesión para ver tu estado en la comunidad.",
    active: "Comunidad confirmada",
    statusBody: "El acceso a la cuenta y la pertenencia a la comunidad siguen separados técnicamente. Este estado procede del registro comunitario confirmado.",
    toCommunity: "Ir a la comunidad",
    passwordEyebrow: "Acceso a la comunidad",
    setupIntro: "También funciona para registros de comunidad confirmados antes de introducir el nuevo inicio de sesión.",
    setIntro: "Define una nueva contraseña para tu acceso comunitario confirmado.",
    emailLabel: "Correo del registro comunitario",
    genericSent: "Si existe un registro comunitario confirmado para este correo, hemos enviado un enlace para configurar la contraseña.",
  },
  pl: {
    join: "Dołącz do społeczności",
    loginIntro: "Logowanie jest dostępne dla potwierdzonych dostępów do społeczności.",
    noMember: "Nie należysz jeszcze do społeczności?",
    accountEyebrow: "Konto społeczności",
    unauthenticated: "Zaloguj się, aby zobaczyć swój status w społeczności.",
    active: "Społeczność potwierdzona",
    statusBody: "Dostęp do konta i przynależność do społeczności pozostają technicznie rozdzielone. Ten status pochodzi z potwierdzonego rekordu społeczności.",
    toCommunity: "Do społeczności",
    passwordEyebrow: "Dostęp do społeczności",
    setupIntro: "Działa to również dla rejestracji społeczności potwierdzonych przed wprowadzeniem nowego logowania.",
    setIntro: "Ustaw nowe hasło dla potwierdzonego dostępu do społeczności.",
    emailLabel: "E-mail rejestracji w społeczności",
    genericSent: "Jeśli dla tego adresu istnieje potwierdzona rejestracja w społeczności, wysłaliśmy link do ustawienia hasła.",
  },
  it: {
    join: "Unisciti alla community",
    loginIntro: "L’accesso è disponibile per gli accessi alla community confermati.",
    noMember: "Non fai ancora parte della community?",
    accountEyebrow: "Account community",
    unauthenticated: "Accedi per vedere il tuo stato nella community.",
    active: "Community confermata",
    statusBody: "L’accesso all’account e l’appartenenza alla community restano tecnicamente separati. Questo stato proviene dal record community confermato.",
    toCommunity: "Vai alla community",
    passwordEyebrow: "Accesso community",
    setupIntro: "Funziona anche per le registrazioni alla community confermate prima dell’introduzione del nuovo accesso.",
    setIntro: "Imposta una nuova password per il tuo accesso community confermato.",
    emailLabel: "E-mail della registrazione community",
    genericSent: "Se per questa e-mail esiste una registrazione community confermata, abbiamo inviato un link per impostare la password.",
  },
  tr: {
    join: "Topluluğa katıl",
    loginIntro: "Giriş, onaylanmış topluluk erişimleri için kullanılabilir.",
    noMember: "Henüz topluluğun parçası değil misin?",
    accountEyebrow: "Topluluk hesabı",
    unauthenticated: "Topluluk durumunu görmek için giriş yap.",
    active: "Topluluk onaylandı",
    statusBody: "Hesap erişimi ile topluluk aidiyeti teknik olarak ayrı kalır. Bu durum onaylanmış topluluk kaydından gelir.",
    toCommunity: "Topluluğa git",
    passwordEyebrow: "Topluluk erişimi",
    setupIntro: "Bu, yeni giriş sistemi sunulmadan önce onaylanan topluluk kayıtları için de çalışır.",
    setIntro: "Onaylanmış topluluk erişimin için yeni bir parola belirle.",
    emailLabel: "Topluluk kaydı e-postası",
    genericSent: "Bu e-posta için onaylanmış bir topluluk kaydı varsa parola oluşturma bağlantısı gönderdik.",
  },
  ar: {
    join: "انضم إلى المجتمع",
    loginIntro: "تسجيل الدخول متاح لوصول المجتمع المؤكد.",
    noMember: "لست جزءًا من المجتمع بعد؟",
    accountEyebrow: "حساب المجتمع",
    unauthenticated: "يرجى تسجيل الدخول لعرض حالة انضمامك إلى المجتمع.",
    active: "تم تأكيد المجتمع",
    statusBody: "يبقى الوصول إلى الحساب والانضمام إلى المجتمع منفصلين تقنيًا. تأتي هذه الحالة من سجل المجتمع المؤكد.",
    toCommunity: "إلى المجتمع",
    passwordEyebrow: "وصول المجتمع",
    setupIntro: "يعمل هذا أيضًا لتسجيلات المجتمع التي تم تأكيدها قبل تقديم نظام تسجيل الدخول الجديد.",
    setIntro: "عيّن كلمة مرور جديدة لوصولك المؤكد إلى المجتمع.",
    emailLabel: "بريد تسجيل المجتمع",
    genericSent: "إذا كان هناك تسجيل مؤكد في المجتمع لهذا البريد، فقد أرسلنا رابطًا لإعداد كلمة المرور.",
  },
  ru: {
    join: "Присоединиться к сообществу",
    loginIntro: "Вход доступен для подтверждённого доступа к сообществу.",
    noMember: "Вы ещё не в сообществе?",
    accountEyebrow: "Аккаунт сообщества",
    unauthenticated: "Войдите, чтобы увидеть свой статус в сообществе.",
    active: "Сообщество подтверждено",
    statusBody: "Доступ к аккаунту и принадлежность к сообществу технически разделены. Этот статус берётся из подтверждённой записи сообщества.",
    toCommunity: "К сообществу",
    passwordEyebrow: "Доступ к сообществу",
    setupIntro: "Это также работает для регистраций в сообществе, подтверждённых до появления нового входа.",
    setIntro: "Установите новый пароль для подтверждённого доступа к сообществу.",
    emailLabel: "E-mail регистрации в сообществе",
    genericSent: "Если для этого e-mail существует подтверждённая регистрация в сообществе, мы отправили ссылку для установки пароля.",
  },
  zh: {
    join: "加入社区",
    loginIntro: "登录适用于已确认的社区访问。",
    noMember: "还未加入社区？",
    accountEyebrow: "社区账户",
    unauthenticated: "请登录以查看你的社区状态。",
    active: "社区已确认",
    statusBody: "账户访问与社区归属在技术上保持分离。此状态来自已确认的社区记录。",
    toCommunity: "前往社区",
    passwordEyebrow: "社区访问",
    setupIntro: "这也适用于新登录功能推出前已确认的社区注册。",
    setIntro: "为已确认的社区访问设置新密码。",
    emailLabel: "社区注册电子邮箱",
    genericSent: "如果此邮箱存在已确认的社区注册，我们已发送密码设置链接。",
  },
};

export function getCommunityAccountStrings(locale: SupportedLocale) {
  const base = getMemberAccountStrings(locale);
  const override = OVERRIDES[locale] ?? OVERRIDES.en;

  return {
    ...base,
    common: {
      ...base.common,
      join: override.join,
    },
    login: {
      ...base.login,
      intro: override.loginIntro,
      noMember: override.noMember,
    },
    account: {
      ...base.account,
      eyebrow: override.accountEyebrow,
      unauthenticated: override.unauthenticated,
      active: override.active,
      statusBody: override.statusBody,
      toMovement: override.toCommunity,
    },
    password: {
      ...base.password,
      eyebrow: override.passwordEyebrow,
      setupIntro: override.setupIntro,
      setIntro: override.setIntro,
      emailLabel: override.emailLabel,
      genericSent: override.genericSent,
    },
  };
}
