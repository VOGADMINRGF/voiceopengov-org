import type { SupportedLocale } from "@/config/locales";

const EN = {
  common: {
    brand: "VoiceOpenGov", email: "Email", password: "Password", login: "Sign in",
    join: "Become a member", setupAccess: "Set up access", home: "Back to home", contact: "Contact",
    rateLimited: "Too many attempts. Please try again later.",
    networkError: "The connection could not be established. Please try again.",
  },
  join: {
    eyebrow: "VoiceOpenGov", title: "Become a member.",
    intro: "An account is not yet an active membership. Your membership is activated only after email confirmation.",
    memberType: "Member type", person: "Person", organisation: "Organisation", firstName: "First name", lastName: "Last name",
    birthDate: "Date of birth", organisationName: "Organisation name", city: "City", country: "Country (ISO code)",
    passwordHint: "At least 12 characters, one number and one special character.",
    publicLocation: "My region may appear in public, aggregated local totals.",
    newsletter: "I would like to receive VoiceOpenGov updates.",
    edebatteNewsletter: "I would also like to receive eDebatte updates.",
    privacyPrefix: "I accept the", privacyLink: "privacy notice", submit: "Start membership", submitting: "Creating …",
    alreadyMember: "Already a member?", successBadge: "Next step", successTitle: "Check your email now.",
    successBody: "We sent you an email with the next secure step. A new membership becomes active only after email confirmation; existing members receive access through the same controlled channel.",
    missingPrivacy: "Please accept the privacy notice.", missingPerson: "Please complete your name and date of birth.",
    missingOrganisation: "Please enter the organisation name.", failed: "Registration could not be completed.",
    invalidBirthdate: "Please enter a valid date of birth.", underage: "Membership is available from age 16.",
    passwordTooShort: "The password must be at least 12 characters long.", passwordTooLong: "The password may contain at most 128 characters.",
    passwordNeedsNumber: "The password must contain at least one number.", passwordNeedsSpecial: "The password must contain at least one special character.",
  },
  login: {
    title: "Sign in", intro: "Sign-in is available for confirmed memberships.",
    invalid: "The email or password is incorrect, or the email has not been confirmed yet.", submit: "Sign in", submitting: "Signing in …",
    noMember: "Not a member yet?",
  },
  account: {
    eyebrow: "Member account", loading: "Loading account …", title: "Your account",
    unauthenticated: "Please sign in to view your membership status.", logout: "Sign out", status: "Status", active: "Membership active",
    statusBody: "Account and active membership remain technically separate. This status comes from the confirmed membership record.",
    region: "Region", notSet: "Not provided yet", publicSums: "Public local totals", allowed: "enabled", notAllowed: "disabled",
    communication: "Communication", vogUpdates: "VoiceOpenGov updates", edebatteUpdates: "eDebatte updates", supporterBanner: "Supporter banner",
    on: "on", off: "off", toMovement: "Go to the movement", changePassword: "Change password",
  },
  password: {
    eyebrow: "Member access", setupTitle: "Set up access", setTitle: "Set password",
    setupIntro: "This also works for memberships confirmed before the new sign-in was introduced.",
    setIntro: "Set a new password for your confirmed member access.", emailLabel: "Membership email", requestLink: "Send setup link",
    requesting: "Sending …", genericSent: "If an active membership exists for this email, we sent a link to set up the password.",
    newPassword: "New password", repeatPassword: "Repeat password", hint: "At least 12 characters, one number and one special character.",
    save: "Save password", saving: "Saving …", savedTitle: "Password saved.", savedBody: "You can now sign in with your email address.",
    backLogin: "Back to sign in", mismatch: "The two passwords do not match.",
    invalidToken: "The link is invalid or has expired. Please request a new one.", failed: "The password could not be saved. Please try again.",
  },
};

const DE = {
  common: {
    brand: "VoiceOpenGov", email: "E-Mail", password: "Passwort", login: "Anmelden", join: "Mitglied werden",
    setupAccess: "Zugang einrichten", home: "Zur Startseite", contact: "Kontakt",
    rateLimited: "Zu viele Versuche. Bitte versuche es später erneut.",
    networkError: "Die Verbindung konnte nicht hergestellt werden. Bitte versuche es erneut.",
  },
  join: {
    eyebrow: "VoiceOpenGov", title: "Mitglied werden.",
    intro: "Ein Account ist noch keine aktive Mitgliedschaft. Deine Mitgliedschaft wird erst nach der E-Mail-Bestätigung aktiviert.",
    memberType: "Mitgliedstyp", person: "Person", organisation: "Organisation", firstName: "Vorname", lastName: "Nachname",
    birthDate: "Geburtsdatum", organisationName: "Name der Organisation", city: "Ort", country: "Land (ISO-Code)",
    passwordHint: "Mindestens 12 Zeichen, eine Zahl und ein Sonderzeichen.",
    publicLocation: "Meine Region darf in den öffentlichen, aggregierten Orts-Summen erscheinen.",
    newsletter: "Ich möchte Updates von VoiceOpenGov erhalten.", edebatteNewsletter: "Ich möchte zusätzlich Updates zu eDebatte erhalten.",
    privacyPrefix: "Ich akzeptiere die", privacyLink: "Datenschutzhinweise", submit: "Mitgliedschaft starten", submitting: "Wird angelegt …",
    alreadyMember: "Schon Mitglied?", successBadge: "Nächster Schritt", successTitle: "Prüfe jetzt deine E-Mail.",
    successBody: "Wir haben dir eine E-Mail mit dem nächsten sicheren Schritt geschickt. Eine neue Mitgliedschaft wird erst nach der E-Mail-Bestätigung aktiv; bestehende Mitglieder erhalten darüber ihren Zugang.",
    missingPrivacy: "Bitte bestätige die Datenschutzhinweise.", missingPerson: "Bitte fülle Name und Geburtsdatum vollständig aus.",
    missingOrganisation: "Bitte gib den Namen der Organisation an.", failed: "Die Registrierung konnte nicht abgeschlossen werden.",
    invalidBirthdate: "Bitte gib ein gültiges Geburtsdatum an.", underage: "Die Mitgliedschaft ist ab 16 Jahren möglich.",
    passwordTooShort: "Das Passwort muss mindestens 12 Zeichen lang sein.", passwordTooLong: "Das Passwort darf höchstens 128 Zeichen lang sein.",
    passwordNeedsNumber: "Das Passwort benötigt mindestens eine Zahl.", passwordNeedsSpecial: "Das Passwort benötigt mindestens ein Sonderzeichen.",
  },
  login: {
    title: "Anmelden", intro: "Der Login ist für bestätigte Mitgliedschaften verfügbar.",
    invalid: "E-Mail oder Passwort sind nicht korrekt – oder die E-Mail wurde noch nicht bestätigt.", submit: "Anmelden", submitting: "Anmeldung läuft …",
    noMember: "Noch kein Mitglied?",
  },
  account: {
    eyebrow: "Mitgliedskonto", loading: "Konto wird geladen …", title: "Dein Konto",
    unauthenticated: "Bitte melde dich an, um deinen Mitgliedsstatus zu sehen.", logout: "Abmelden", status: "Status", active: "Mitgliedschaft aktiv",
    statusBody: "Account und aktive Mitgliedschaft bleiben technisch getrennt. Dieser Status stammt aus dem bestätigten Mitgliedsdatensatz.",
    region: "Region", notSet: "Noch nicht hinterlegt", publicSums: "Öffentliche Orts-Summen", allowed: "freigegeben", notAllowed: "nicht freigegeben",
    communication: "Kommunikation", vogUpdates: "VoiceOpenGov Updates", edebatteUpdates: "eDebatte Updates", supporterBanner: "Unterstützer-Banner",
    on: "an", off: "aus", toMovement: "Zur Bewegung", changePassword: "Passwort ändern",
  },
  password: {
    eyebrow: "Mitgliedszugang", setupTitle: "Zugang einrichten", setTitle: "Passwort festlegen",
    setupIntro: "Das funktioniert auch für Mitgliedschaften, die schon vor dem neuen Login bestätigt wurden.",
    setIntro: "Lege ein neues Passwort für deinen bestätigten Mitgliedszugang fest.", emailLabel: "E-Mail deiner Mitgliedschaft",
    requestLink: "Einrichtungslink senden", requesting: "Wird gesendet …",
    genericSent: "Wenn eine aktive Mitgliedschaft zu dieser E-Mail besteht, haben wir dir einen Link zum Einrichten des Passworts geschickt.",
    newPassword: "Neues Passwort", repeatPassword: "Passwort wiederholen", hint: "Mindestens 12 Zeichen, eine Zahl und ein Sonderzeichen.",
    save: "Passwort speichern", saving: "Wird gespeichert …", savedTitle: "Passwort gespeichert.",
    savedBody: "Du kannst dich jetzt mit deiner E-Mail-Adresse anmelden.", backLogin: "Zurück zum Login",
    mismatch: "Die beiden Passwörter stimmen nicht überein.", invalidToken: "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.",
    failed: "Das Passwort konnte nicht gespeichert werden. Bitte versuche es erneut.",
  },
};

const FR = {
  common: { brand: "VoiceOpenGov", email: "E-mail", password: "Mot de passe", login: "Se connecter", join: "Devenir membre", setupAccess: "Configurer l’accès", home: "Retour à l’accueil", contact: "Contact", rateLimited: "Trop de tentatives. Veuillez réessayer plus tard.", networkError: "La connexion n’a pas pu être établie. Veuillez réessayer." },
  join: { eyebrow: "VoiceOpenGov", title: "Devenir membre.", intro: "Un compte ne constitue pas encore une adhésion active. L’adhésion n’est activée qu’après confirmation de l’e-mail.", memberType: "Type de membre", person: "Personne", organisation: "Organisation", firstName: "Prénom", lastName: "Nom", birthDate: "Date de naissance", organisationName: "Nom de l’organisation", city: "Ville", country: "Pays (code ISO)", passwordHint: "Au moins 12 caractères, un chiffre et un caractère spécial.", publicLocation: "Ma région peut apparaître dans les totaux locaux publics et agrégés.", newsletter: "Je souhaite recevoir les actualités de VoiceOpenGov.", edebatteNewsletter: "Je souhaite également recevoir les actualités d’eDebatte.", privacyPrefix: "J’accepte les", privacyLink: "informations sur la confidentialité", submit: "Démarrer l’adhésion", submitting: "Création …", alreadyMember: "Déjà membre ?", successBadge: "Étape suivante", successTitle: "Consultez maintenant votre e-mail.", successBody: "Nous vous avons envoyé un e-mail avec l’étape sécurisée suivante. Une nouvelle adhésion n’est activée qu’après confirmation de l’e-mail ; les membres existants reçoivent leur accès par ce même canal contrôlé.", missingPrivacy: "Veuillez accepter les informations sur la confidentialité.", missingPerson: "Veuillez renseigner votre nom et votre date de naissance.", missingOrganisation: "Veuillez indiquer le nom de l’organisation.", failed: "L’inscription n’a pas pu être finalisée.", invalidBirthdate: "Veuillez saisir une date de naissance valide.", underage: "L’adhésion est possible à partir de 16 ans.", passwordTooShort: "Le mot de passe doit contenir au moins 12 caractères.", passwordTooLong: "Le mot de passe ne peut pas dépasser 128 caractères.", passwordNeedsNumber: "Le mot de passe doit contenir au moins un chiffre.", passwordNeedsSpecial: "Le mot de passe doit contenir au moins un caractère spécial." },
  login: { title: "Se connecter", intro: "La connexion est disponible pour les adhésions confirmées.", invalid: "L’e-mail ou le mot de passe est incorrect, ou l’e-mail n’a pas encore été confirmé.", submit: "Se connecter", submitting: "Connexion …", noMember: "Pas encore membre ?" },
  account: { eyebrow: "Compte membre", loading: "Chargement du compte …", title: "Votre compte", unauthenticated: "Veuillez vous connecter pour voir le statut de votre adhésion.", logout: "Se déconnecter", status: "Statut", active: "Adhésion active", statusBody: "Le compte et l’adhésion active restent techniquement séparés. Ce statut provient du dossier d’adhésion confirmé.", region: "Région", notSet: "Pas encore renseigné", publicSums: "Totaux locaux publics", allowed: "activés", notAllowed: "désactivés", communication: "Communication", vogUpdates: "Actualités VoiceOpenGov", edebatteUpdates: "Actualités eDebatte", supporterBanner: "Bannière de soutien", on: "activé", off: "désactivé", toMovement: "Vers le mouvement", changePassword: "Modifier le mot de passe" },
  password: { eyebrow: "Accès membre", setupTitle: "Configurer l’accès", setTitle: "Définir le mot de passe", setupIntro: "Cela fonctionne aussi pour les adhésions confirmées avant l’introduction de la nouvelle connexion.", setIntro: "Définissez un nouveau mot de passe pour votre accès membre confirmé.", emailLabel: "E-mail de l’adhésion", requestLink: "Envoyer le lien", requesting: "Envoi …", genericSent: "Si une adhésion active existe pour cet e-mail, nous avons envoyé un lien pour définir le mot de passe.", newPassword: "Nouveau mot de passe", repeatPassword: "Répéter le mot de passe", hint: "Au moins 12 caractères, un chiffre et un caractère spécial.", save: "Enregistrer le mot de passe", saving: "Enregistrement …", savedTitle: "Mot de passe enregistré.", savedBody: "Vous pouvez maintenant vous connecter avec votre adresse e-mail.", backLogin: "Retour à la connexion", mismatch: "Les deux mots de passe ne correspondent pas.", invalidToken: "Le lien est invalide ou a expiré. Veuillez en demander un nouveau.", failed: "Le mot de passe n’a pas pu être enregistré. Veuillez réessayer." },
};

const ES = {
  common: { brand: "VoiceOpenGov", email: "Correo electrónico", password: "Contraseña", login: "Iniciar sesión", join: "Hacerse miembro", setupAccess: "Configurar acceso", home: "Volver al inicio", contact: "Contacto", rateLimited: "Demasiados intentos. Inténtalo de nuevo más tarde.", networkError: "No se pudo establecer la conexión. Inténtalo de nuevo." },
  join: { eyebrow: "VoiceOpenGov", title: "Hazte miembro.", intro: "Una cuenta todavía no es una membresía activa. La membresía se activa únicamente después de confirmar el correo electrónico.", memberType: "Tipo de miembro", person: "Persona", organisation: "Organización", firstName: "Nombre", lastName: "Apellidos", birthDate: "Fecha de nacimiento", organisationName: "Nombre de la organización", city: "Ciudad", country: "País (código ISO)", passwordHint: "Al menos 12 caracteres, un número y un carácter especial.", publicLocation: "Mi región puede aparecer en los totales locales públicos y agregados.", newsletter: "Quiero recibir novedades de VoiceOpenGov.", edebatteNewsletter: "También quiero recibir novedades de eDebatte.", privacyPrefix: "Acepto el", privacyLink: "aviso de privacidad", submit: "Iniciar membresía", submitting: "Creando …", alreadyMember: "¿Ya eres miembro?", successBadge: "Siguiente paso", successTitle: "Revisa ahora tu correo electrónico.", successBody: "Te hemos enviado un correo con el siguiente paso seguro. Una nueva membresía solo se activa tras confirmar el correo; los miembros existentes reciben su acceso por el mismo canal controlado.", missingPrivacy: "Acepta el aviso de privacidad.", missingPerson: "Completa tu nombre y fecha de nacimiento.", missingOrganisation: "Indica el nombre de la organización.", failed: "No se pudo completar el registro.", invalidBirthdate: "Introduce una fecha de nacimiento válida.", underage: "La membresía está disponible a partir de los 16 años.", passwordTooShort: "La contraseña debe tener al menos 12 caracteres.", passwordTooLong: "La contraseña puede tener como máximo 128 caracteres.", passwordNeedsNumber: "La contraseña debe contener al menos un número.", passwordNeedsSpecial: "La contraseña debe contener al menos un carácter especial." },
  login: { title: "Iniciar sesión", intro: "El inicio de sesión está disponible para membresías confirmadas.", invalid: "El correo o la contraseña no son correctos, o el correo aún no ha sido confirmado.", submit: "Iniciar sesión", submitting: "Iniciando sesión …", noMember: "¿Aún no eres miembro?" },
  account: { eyebrow: "Cuenta de miembro", loading: "Cargando cuenta …", title: "Tu cuenta", unauthenticated: "Inicia sesión para ver el estado de tu membresía.", logout: "Cerrar sesión", status: "Estado", active: "Membresía activa", statusBody: "La cuenta y la membresía activa permanecen técnicamente separadas. Este estado procede del registro de membresía confirmado.", region: "Región", notSet: "Aún no indicado", publicSums: "Totales locales públicos", allowed: "habilitados", notAllowed: "deshabilitados", communication: "Comunicación", vogUpdates: "Novedades de VoiceOpenGov", edebatteUpdates: "Novedades de eDebatte", supporterBanner: "Banner de apoyo", on: "activado", off: "desactivado", toMovement: "Ir al movimiento", changePassword: "Cambiar contraseña" },
  password: { eyebrow: "Acceso de miembro", setupTitle: "Configurar acceso", setTitle: "Establecer contraseña", setupIntro: "También funciona para membresías confirmadas antes de introducir el nuevo inicio de sesión.", setIntro: "Establece una nueva contraseña para tu acceso de miembro confirmado.", emailLabel: "Correo de la membresía", requestLink: "Enviar enlace", requesting: "Enviando …", genericSent: "Si existe una membresía activa para este correo, hemos enviado un enlace para configurar la contraseña.", newPassword: "Nueva contraseña", repeatPassword: "Repetir contraseña", hint: "Al menos 12 caracteres, un número y un carácter especial.", save: "Guardar contraseña", saving: "Guardando …", savedTitle: "Contraseña guardada.", savedBody: "Ya puedes iniciar sesión con tu correo electrónico.", backLogin: "Volver al inicio de sesión", mismatch: "Las dos contraseñas no coinciden.", invalidToken: "El enlace no es válido o ha caducado. Solicita uno nuevo.", failed: "No se pudo guardar la contraseña. Inténtalo de nuevo." },
};

const TR = {
  common: { brand: "VoiceOpenGov", email: "E-posta", password: "Şifre", login: "Giriş yap", join: "Üye ol", setupAccess: "Erişimi ayarla", home: "Ana sayfaya dön", contact: "İletişim", rateLimited: "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.", networkError: "Bağlantı kurulamadı. Lütfen tekrar deneyin." },
  join: { eyebrow: "VoiceOpenGov", title: "Üye ol.", intro: "Bir hesap henüz aktif üyelik değildir. Üyeliğiniz yalnızca e-posta onayından sonra etkinleşir.", memberType: "Üye türü", person: "Kişi", organisation: "Kuruluş", firstName: "Ad", lastName: "Soyad", birthDate: "Doğum tarihi", organisationName: "Kuruluş adı", city: "Şehir", country: "Ülke (ISO kodu)", passwordHint: "En az 12 karakter, bir rakam ve bir özel karakter.", publicLocation: "Bölgem, herkese açık toplu yerel toplamlarında görünebilir.", newsletter: "VoiceOpenGov güncellemelerini almak istiyorum.", edebatteNewsletter: "Ayrıca eDebatte güncellemelerini almak istiyorum.", privacyPrefix: "Şunları kabul ediyorum:", privacyLink: "gizlilik bildirimi", submit: "Üyeliği başlat", submitting: "Oluşturuluyor …", alreadyMember: "Zaten üye misiniz?", successBadge: "Sonraki adım", successTitle: "Şimdi e-postanızı kontrol edin.", successBody: "Size bir sonraki güvenli adımı içeren bir e-posta gönderdik. Yeni üyelik ancak e-posta onayından sonra etkinleşir; mevcut üyeler erişimlerini aynı kontrollü kanal üzerinden alır.", missingPrivacy: "Lütfen gizlilik bildirimini kabul edin.", missingPerson: "Lütfen adınızı ve doğum tarihinizi eksiksiz girin.", missingOrganisation: "Lütfen kuruluş adını girin.", failed: "Kayıt tamamlanamadı.", invalidBirthdate: "Lütfen geçerli bir doğum tarihi girin.", underage: "Üyelik 16 yaşından itibaren mümkündür.", passwordTooShort: "Şifre en az 12 karakter olmalıdır.", passwordTooLong: "Şifre en fazla 128 karakter olabilir.", passwordNeedsNumber: "Şifre en az bir rakam içermelidir.", passwordNeedsSpecial: "Şifre en az bir özel karakter içermelidir." },
  login: { title: "Giriş yap", intro: "Giriş, onaylanmış üyelikler için kullanılabilir.", invalid: "E-posta veya şifre yanlış ya da e-posta henüz onaylanmamış.", submit: "Giriş yap", submitting: "Giriş yapılıyor …", noMember: "Henüz üye değil misiniz?" },
  account: { eyebrow: "Üye hesabı", loading: "Hesap yükleniyor …", title: "Hesabınız", unauthenticated: "Üyelik durumunuzu görmek için lütfen giriş yapın.", logout: "Çıkış yap", status: "Durum", active: "Üyelik aktif", statusBody: "Hesap ve aktif üyelik teknik olarak ayrı kalır. Bu durum onaylanmış üyelik kaydından gelir.", region: "Bölge", notSet: "Henüz girilmedi", publicSums: "Herkese açık yerel toplamlar", allowed: "açık", notAllowed: "kapalı", communication: "İletişim", vogUpdates: "VoiceOpenGov güncellemeleri", edebatteUpdates: "eDebatte güncellemeleri", supporterBanner: "Destekçi bandı", on: "açık", off: "kapalı", toMovement: "Harekete git", changePassword: "Şifreyi değiştir" },
  password: { eyebrow: "Üye erişimi", setupTitle: "Erişimi ayarla", setTitle: "Şifre belirle", setupIntro: "Bu işlem, yeni giriş sistemi devreye girmeden önce onaylanmış üyelikler için de çalışır.", setIntro: "Onaylanmış üye erişiminiz için yeni bir şifre belirleyin.", emailLabel: "Üyelik e-postası", requestLink: "Kurulum bağlantısı gönder", requesting: "Gönderiliyor …", genericSent: "Bu e-posta için aktif bir üyelik varsa şifreyi ayarlamak üzere bir bağlantı gönderdik.", newPassword: "Yeni şifre", repeatPassword: "Şifreyi tekrar girin", hint: "En az 12 karakter, bir rakam ve bir özel karakter.", save: "Şifreyi kaydet", saving: "Kaydediliyor …", savedTitle: "Şifre kaydedildi.", savedBody: "Artık e-posta adresinizle giriş yapabilirsiniz.", backLogin: "Girişe dön", mismatch: "İki şifre eşleşmiyor.", invalidToken: "Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.", failed: "Şifre kaydedilemedi. Lütfen tekrar deneyin." },
};

const AR = {
  common: { brand: "VoiceOpenGov", email: "البريد الإلكتروني", password: "كلمة المرور", login: "تسجيل الدخول", join: "الانضمام كعضو", setupAccess: "إعداد الوصول", home: "العودة إلى الرئيسية", contact: "تواصل", rateLimited: "محاولات كثيرة جدًا. يرجى المحاولة لاحقًا.", networkError: "تعذر إنشاء الاتصال. يرجى المحاولة مرة أخرى." },
  join: { eyebrow: "VoiceOpenGov", title: "انضم كعضو.", intro: "إنشاء حساب لا يعني بعد عضوية نشطة. تُفعّل العضوية فقط بعد تأكيد البريد الإلكتروني.", memberType: "نوع العضوية", person: "فرد", organisation: "منظمة", firstName: "الاسم الأول", lastName: "اسم العائلة", birthDate: "تاريخ الميلاد", organisationName: "اسم المنظمة", city: "المدينة", country: "الدولة (رمز ISO)", passwordHint: "12 حرفًا على الأقل، ورقم واحد، ورمز خاص واحد.", publicLocation: "يمكن أن تظهر منطقتي ضمن المجاميع المحلية العامة والمجمعة.", newsletter: "أرغب في تلقي تحديثات VoiceOpenGov.", edebatteNewsletter: "أرغب أيضًا في تلقي تحديثات eDebatte.", privacyPrefix: "أوافق على", privacyLink: "إشعار الخصوصية", submit: "بدء العضوية", submitting: "جارٍ الإنشاء …", alreadyMember: "هل أنت عضو بالفعل؟", successBadge: "الخطوة التالية", successTitle: "تحقق من بريدك الإلكتروني الآن.", successBody: "أرسلنا إليك بريدًا إلكترونيًا يتضمن الخطوة الآمنة التالية. لا تُفعّل العضوية الجديدة إلا بعد تأكيد البريد؛ ويحصل الأعضاء الحاليون على الوصول عبر القناة الموثوقة نفسها.", missingPrivacy: "يرجى الموافقة على إشعار الخصوصية.", missingPerson: "يرجى إدخال الاسم وتاريخ الميلاد بالكامل.", missingOrganisation: "يرجى إدخال اسم المنظمة.", failed: "تعذر إكمال التسجيل.", invalidBirthdate: "يرجى إدخال تاريخ ميلاد صالح.", underage: "العضوية متاحة من سن 16 عامًا.", passwordTooShort: "يجب ألا تقل كلمة المرور عن 12 حرفًا.", passwordTooLong: "يجب ألا تزيد كلمة المرور عن 128 حرفًا.", passwordNeedsNumber: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.", passwordNeedsSpecial: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل." },
  login: { title: "تسجيل الدخول", intro: "تسجيل الدخول متاح للعضويات المؤكدة.", invalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو لم يتم تأكيد البريد بعد.", submit: "تسجيل الدخول", submitting: "جارٍ تسجيل الدخول …", noMember: "لست عضوًا بعد؟" },
  account: { eyebrow: "حساب العضو", loading: "جارٍ تحميل الحساب …", title: "حسابك", unauthenticated: "يرجى تسجيل الدخول لعرض حالة عضويتك.", logout: "تسجيل الخروج", status: "الحالة", active: "العضوية نشطة", statusBody: "يبقى الحساب والعضوية النشطة منفصلين تقنيًا. تأتي هذه الحالة من سجل العضوية المؤكد.", region: "المنطقة", notSet: "لم تُضف بعد", publicSums: "المجاميع المحلية العامة", allowed: "مفعّلة", notAllowed: "غير مفعّلة", communication: "التواصل", vogUpdates: "تحديثات VoiceOpenGov", edebatteUpdates: "تحديثات eDebatte", supporterBanner: "شارة الدعم", on: "مفعّل", off: "متوقف", toMovement: "إلى الحركة", changePassword: "تغيير كلمة المرور" },
  password: { eyebrow: "وصول العضو", setupTitle: "إعداد الوصول", setTitle: "تعيين كلمة المرور", setupIntro: "يعمل هذا أيضًا للعضويات التي تم تأكيدها قبل إطلاق تسجيل الدخول الجديد.", setIntro: "عيّن كلمة مرور جديدة لوصولك كعضو مؤكد.", emailLabel: "بريد العضوية", requestLink: "إرسال رابط الإعداد", requesting: "جارٍ الإرسال …", genericSent: "إذا كانت هناك عضوية نشطة لهذا البريد الإلكتروني، فقد أرسلنا رابطًا لإعداد كلمة المرور.", newPassword: "كلمة مرور جديدة", repeatPassword: "تكرار كلمة المرور", hint: "12 حرفًا على الأقل، ورقم واحد، ورمز خاص واحد.", save: "حفظ كلمة المرور", saving: "جارٍ الحفظ …", savedTitle: "تم حفظ كلمة المرور.", savedBody: "يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني.", backLogin: "العودة إلى تسجيل الدخول", mismatch: "كلمتا المرور غير متطابقتين.", invalidToken: "الرابط غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.", failed: "تعذر حفظ كلمة المرور. يرجى المحاولة مرة أخرى." },
};

const PL = {
  ...EN,
  common: { ...EN.common, email: "E-mail", password: "Hasło", login: "Zaloguj się", join: "Zostań członkiem", setupAccess: "Skonfiguruj dostęp", home: "Wróć na stronę główną", contact: "Kontakt", rateLimited: "Zbyt wiele prób. Spróbuj ponownie później.", networkError: "Nie udało się nawiązać połączenia. Spróbuj ponownie." },
  join: { ...EN.join, person: "Osoba", organisation: "Organizacja", passwordTooShort: "Hasło musi mieć co najmniej 12 znaków.", passwordTooLong: "Hasło może mieć maksymalnie 128 znaków.", passwordNeedsNumber: "Hasło musi zawierać co najmniej jedną cyfrę.", passwordNeedsSpecial: "Hasło musi zawierać co najmniej jeden znak specjalny." },
  login: { title: "Zaloguj się", intro: "Logowanie jest dostępne dla potwierdzonych członkostw.", invalid: "Adres e-mail lub hasło są nieprawidłowe albo e-mail nie został jeszcze potwierdzony.", submit: "Zaloguj się", submitting: "Logowanie …", noMember: "Nie jesteś jeszcze członkiem?" },
  account: { ...EN.account, eyebrow: "Konto członka", loading: "Ładowanie konta …", title: "Twoje konto", unauthenticated: "Zaloguj się, aby zobaczyć status członkostwa.", logout: "Wyloguj się", status: "Status", active: "Członkostwo aktywne", statusBody: "Konto i aktywne członkostwo pozostają technicznie rozdzielone. Ten status pochodzi z potwierdzonego rekordu członkostwa.", region: "Region", notSet: "Jeszcze nie podano", publicSums: "Publiczne sumy lokalne", allowed: "włączone", notAllowed: "wyłączone", communication: "Komunikacja", vogUpdates: "Aktualności VoiceOpenGov", edebatteUpdates: "Aktualności eDebatte", supporterBanner: "Baner wspierającego", on: "włączone", off: "wyłączone", toMovement: "Przejdź do ruchu", changePassword: "Zmień hasło" },
  password: { ...EN.password, eyebrow: "Dostęp członka", setupTitle: "Skonfiguruj dostęp", setTitle: "Ustaw hasło", setupIntro: "Działa to również dla członkostw potwierdzonych przed uruchomieniem logowania.", setIntro: "Ustaw nowe hasło dla potwierdzonego dostępu członka.", emailLabel: "E-mail członkostwa", requestLink: "Wyślij link konfiguracyjny", requesting: "Wysyłanie …", genericSent: "Jeśli dla tego adresu istnieje aktywne członkostwo, wysłaliśmy link do ustawienia hasła.", newPassword: "Nowe hasło", repeatPassword: "Powtórz hasło", hint: "Co najmniej 12 znaków, jedna cyfra i jeden znak specjalny.", save: "Zapisz hasło", saving: "Zapisywanie …", savedTitle: "Hasło zapisane.", savedBody: "Możesz teraz zalogować się swoim adresem e-mail.", backLogin: "Wróć do logowania", mismatch: "Hasła nie są takie same.", invalidToken: "Link jest nieprawidłowy lub wygasł. Poproś o nowy.", failed: "Nie udało się zapisać hasła. Spróbuj ponownie." },
};

const IT = {
  ...EN,
  common: { ...EN.common, email: "E-mail", password: "Password", login: "Accedi", join: "Diventa membro", setupAccess: "Configura l’accesso", home: "Torna alla home", contact: "Contatti", rateLimited: "Troppi tentativi. Riprova più tardi.", networkError: "Impossibile stabilire la connessione. Riprova." },
  join: { ...EN.join, person: "Persona", organisation: "Organizzazione", passwordTooShort: "La password deve contenere almeno 12 caratteri.", passwordTooLong: "La password può contenere al massimo 128 caratteri.", passwordNeedsNumber: "La password deve contenere almeno un numero.", passwordNeedsSpecial: "La password deve contenere almeno un carattere speciale." },
  login: { title: "Accedi", intro: "L’accesso è disponibile per le adesioni confermate.", invalid: "E-mail o password non corrette, oppure l’e-mail non è ancora stata confermata.", submit: "Accedi", submitting: "Accesso …", noMember: "Non sei ancora membro?" },
  account: { ...EN.account, eyebrow: "Account membro", loading: "Caricamento account …", title: "Il tuo account", unauthenticated: "Accedi per vedere lo stato della tua adesione.", logout: "Esci", status: "Stato", active: "Adesione attiva", statusBody: "Account e adesione attiva restano tecnicamente separati. Questo stato proviene dal record di adesione confermato.", region: "Regione", notSet: "Non ancora indicato", publicSums: "Totali locali pubblici", allowed: "attivi", notAllowed: "disattivi", communication: "Comunicazioni", vogUpdates: "Aggiornamenti VoiceOpenGov", edebatteUpdates: "Aggiornamenti eDebatte", supporterBanner: "Banner sostenitore", on: "attivo", off: "disattivo", toMovement: "Vai al movimento", changePassword: "Cambia password" },
  password: { ...EN.password, eyebrow: "Accesso membro", setupTitle: "Configura l’accesso", setTitle: "Imposta la password", setupIntro: "Funziona anche per le adesioni confermate prima dell’introduzione del nuovo accesso.", setIntro: "Imposta una nuova password per il tuo accesso membro confermato.", emailLabel: "E-mail dell’adesione", requestLink: "Invia link di configurazione", requesting: "Invio …", genericSent: "Se esiste un’adesione attiva per questa e-mail, abbiamo inviato un link per impostare la password.", newPassword: "Nuova password", repeatPassword: "Ripeti password", hint: "Almeno 12 caratteri, un numero e un carattere speciale.", save: "Salva password", saving: "Salvataggio …", savedTitle: "Password salvata.", savedBody: "Ora puoi accedere con il tuo indirizzo e-mail.", backLogin: "Torna all’accesso", mismatch: "Le due password non coincidono.", invalidToken: "Il link non è valido o è scaduto. Richiedine uno nuovo.", failed: "Impossibile salvare la password. Riprova." },
};

const RU = {
  ...EN,
  common: { ...EN.common, email: "Электронная почта", password: "Пароль", login: "Войти", join: "Стать участником", setupAccess: "Настроить доступ", home: "На главную", contact: "Контакты", rateLimited: "Слишком много попыток. Повторите позже.", networkError: "Не удалось установить соединение. Попробуйте ещё раз." },
  join: { ...EN.join, person: "Человек", organisation: "Организация", passwordTooShort: "Пароль должен содержать не менее 12 символов.", passwordTooLong: "Пароль может содержать не более 128 символов.", passwordNeedsNumber: "Пароль должен содержать хотя бы одну цифру.", passwordNeedsSpecial: "Пароль должен содержать хотя бы один специальный символ." },
  login: { title: "Войти", intro: "Вход доступен для подтверждённых участников.", invalid: "Электронная почта или пароль неверны либо адрес ещё не подтверждён.", submit: "Войти", submitting: "Вход …", noMember: "Ещё не участник?" },
  account: { ...EN.account, eyebrow: "Аккаунт участника", loading: "Загрузка аккаунта …", title: "Ваш аккаунт", unauthenticated: "Войдите, чтобы увидеть статус членства.", logout: "Выйти", status: "Статус", active: "Членство активно", statusBody: "Аккаунт и активное членство технически разделены. Статус берётся из подтверждённой записи участника.", region: "Регион", notSet: "Пока не указан", publicSums: "Публичные местные итоги", allowed: "включены", notAllowed: "выключены", communication: "Коммуникация", vogUpdates: "Новости VoiceOpenGov", edebatteUpdates: "Новости eDebatte", supporterBanner: "Баннер поддержки", on: "включено", off: "выключено", toMovement: "К движению", changePassword: "Изменить пароль" },
  password: { ...EN.password, eyebrow: "Доступ участника", setupTitle: "Настроить доступ", setTitle: "Установить пароль", setupIntro: "Это работает и для членства, подтверждённого до запуска нового входа.", setIntro: "Установите новый пароль для подтверждённого доступа участника.", emailLabel: "Электронная почта членства", requestLink: "Отправить ссылку", requesting: "Отправка …", genericSent: "Если для этого адреса существует активное членство, мы отправили ссылку для установки пароля.", newPassword: "Новый пароль", repeatPassword: "Повторите пароль", hint: "Не менее 12 символов, одна цифра и один специальный символ.", save: "Сохранить пароль", saving: "Сохранение …", savedTitle: "Пароль сохранён.", savedBody: "Теперь можно войти с помощью электронной почты.", backLogin: "Назад ко входу", mismatch: "Пароли не совпадают.", invalidToken: "Ссылка недействительна или истекла. Запросите новую.", failed: "Не удалось сохранить пароль. Попробуйте ещё раз." },
};

const ZH = {
  ...EN,
  common: { ...EN.common, email: "电子邮箱", password: "密码", login: "登录", join: "成为会员", setupAccess: "设置访问权限", home: "返回首页", contact: "联系", rateLimited: "尝试次数过多，请稍后再试。", networkError: "无法建立连接，请重试。" },
  join: { ...EN.join, person: "个人", organisation: "组织", passwordTooShort: "密码至少需要12个字符。", passwordTooLong: "密码最多128个字符。", passwordNeedsNumber: "密码必须至少包含一个数字。", passwordNeedsSpecial: "密码必须至少包含一个特殊字符。" },
  login: { title: "登录", intro: "已确认会员可以登录。", invalid: "电子邮箱或密码不正确，或者邮箱尚未确认。", submit: "登录", submitting: "正在登录…", noMember: "还不是会员？" },
  account: { ...EN.account, eyebrow: "会员账户", loading: "正在加载账户…", title: "您的账户", unauthenticated: "请登录以查看会员状态。", logout: "退出登录", status: "状态", active: "会员资格已激活", statusBody: "账户与激活的会员资格在技术上保持分离。此状态来自已确认的会员记录。", region: "地区", notSet: "尚未填写", publicSums: "公开的本地汇总", allowed: "已启用", notAllowed: "未启用", communication: "通讯", vogUpdates: "VoiceOpenGov 更新", edebatteUpdates: "eDebatte 更新", supporterBanner: "支持者横幅", on: "开启", off: "关闭", toMovement: "前往运动主页", changePassword: "修改密码" },
  password: { ...EN.password, eyebrow: "会员访问", setupTitle: "设置访问权限", setTitle: "设置密码", setupIntro: "这也适用于新登录功能推出前已确认的会员。", setIntro: "为已确认的会员访问设置新密码。", emailLabel: "会员电子邮箱", requestLink: "发送设置链接", requesting: "正在发送…", genericSent: "如果此邮箱存在有效会员资格，我们已发送密码设置链接。", newPassword: "新密码", repeatPassword: "重复密码", hint: "至少12个字符、一个数字和一个特殊字符。", save: "保存密码", saving: "正在保存…", savedTitle: "密码已保存。", savedBody: "现在可以使用电子邮箱登录。", backLogin: "返回登录", mismatch: "两次输入的密码不一致。", invalidToken: "链接无效或已过期，请申请新链接。", failed: "无法保存密码，请重试。" },
};

export function getMemberAccountStrings(locale: SupportedLocale) {
  switch (locale) {
    case "de": return DE;
    case "fr": return FR;
    case "es": return ES;
    case "tr": return TR;
    case "ar": return AR;
    case "en": return EN;
    case "pl": return PL;
    case "it": return IT;
    case "ru": return RU;
    case "zh": return ZH;
    default:
      return EN;
  }
}
