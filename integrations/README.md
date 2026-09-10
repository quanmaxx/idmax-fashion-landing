# Tich hop form, Google Sheets va Meta Pixel

## File can cau hinh

Mo file assets/js/marketing-config.js va dien:

- googleAppsScriptUrl: URL Web App Apps Script ket thuc bang /exec
- metaPixelId: Pixel ID trong Meta Events Manager

Khong dat access token vao landing page.

## Quy trinh Google Sheets

1. Tao Google Sheet moi va tao tab Leads.
2. Mo Extensions > Apps Script.
3. Dan noi dung file integrations/google-apps-script/Code.gs.
4. Sua SPREADSHEET_ID va NOTIFY_EMAIL.
5. Chay ham setupSheet mot lan va cap quyen.
6. Chon Deploy > New deployment > Web app.
7. Chon Execute as: Me.
8. Chon quyen truy cap Anyone.
9. Copy URL /exec vao marketing-config.js.

Form gui bang POST thong qua iframe an de tranh loi CORS cua Apps Script.

## Du lieu duoc luu

Form luu thong tin khach hang, UTM, fbclid, gclid, landing page va trang thai cham soc.

## Meta Pixel

lead-form.js tu dong gui:

- PageView khi trang duoc tai
- Lead sau khi Apps Script tra phan hoi thanh cong

Kiem tra trong Meta Events Manager > Test events truoc khi chay quang cao.
