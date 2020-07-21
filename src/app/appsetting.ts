export class AppSettings {
    // public static BASEURL = 'https://gmhrs-api.herokuapp.com/api/';
    public static BASEURL = 'http://localhost:3000/api/';
    public static SCHEDULE = 'schedules/'
    public static EMP = 'employees/'
    public static TEAM = 'teams/'
    public static DEPARTMENT = 'departments/'
    public static TWOFAAUTHGETQRCODE = 'twofa/getQRCode/'
    public static CHECKOTP = 'twofa/checkotp/'
    public static ACTIVATED2FA = 'twofa/activated2fa/'
    public static DEACTIVATED2FA = 'twofa/deactivated2fa/'
    public static CHECK2FASTATUS = 'twofa/check2fastatus/'
    public static CHECKBYPASSOTP = 'twofa/checkbypassotp/'
    public static SIGNATURETEMPLATE = 'signature/saveSignatureTemplateToDB/'
    public static SIGNATURETEMPLATERULES = 'signature/saveSignatureTemplateRules/'
    public static GETSIGNATURE = 'signature/getSignatureTemplate/'
    public static GETSIGNATURERULES = 'signature/getSignatureTemplateRules/'
    public static GETINFOTOREVIEW = 'signature/getInfoToReview/'
    public static UPDATESIGNATUREALL = 'signature/updateSignatureTemplateForAllEmployee/'
    public static GETLISTWRONGSIGANTURE = 'signature/getListEmployeesEmailBreakRule/'
    public static SENDMAILREMIND = 'signature/sendMailRemindEmployees/'
    public static SENDMAILRULESCHANGES = 'signature/sendMailRulesChanges/'
    public static GSUITE = 'gsuite/'
}
