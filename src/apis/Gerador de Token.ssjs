
%%[
  VAR @token, @rows, @randomNumber, @brand, @deName, @errorMessage
  SET @token = ""
  SET @brand = RequestParameter("brand")
  IF Empty(@brand) THEN
    SET @brand = AttributeValue("brand")
  ENDIF
  SET @deName = ""
  SET @errorMessage = ""
  IF Lowercase(Trim(@brand)) == "vichy" THEN
    SET @deName = "tb_vichy_popup_store_users"
  ELSEIF Lowercase(Trim(@brand)) == "hyalu" THEN
    SET @deName = "tb_hyalu_popup_store_users"
  ENDIF
  IF Empty(@deName) THEN
    SET @errorMessage = "Marca inválida ou ausente."
  ELSE
    while Empty(@token) do
    SET @randomNumber = FormatNumber(Random(1, 9999999), "0000000")
    SET @rows = LookupRows(@deName, "token", @randomNumber)
    SET @token = RowCount(@rows)
    IF @token > 0 THEN
      SET @token = ""
      /* Token já existe, continuar gerando outro */
    ELSE
      SET @token = @randomNumber
      /* Token não existe, usá-lo */
    ENDIF
    endwhile
  ENDIF
]%%
<script runat="server">
    Platform.Load("core", "1");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "GET");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "*");
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
    Platform.Response.SetResponseHeader(
      "Strict-Transport-Security",
      "max-age = 0, cache-control: private, no-cache  "
    );
    Platform.Response.SetResponseHeader("X-XSS-Protection", "1; mode=block");
    Platform.Response.SetResponseHeader("X-Frame-Options", "Deny");
    Platform.Response.SetResponseHeader("X-Content-Type-Options", "nosniff");
    Platform.Response.SetResponseHeader(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    Platform.Response.SetResponseHeader(
      "Content-Security-Policy",
      "default-src 'self'"
    );
    Platform.Response.SetResponseHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );

    var token = Variable.GetValue("@token");
    var errorMessage = Variable.GetValue("@errorMessage");

    if (!isEmpty(errorMessage)) {
      Write('{"message":"' + errorMessage + '", "statusCode":400}');
    } else if (isEmpty(token)) {
      Write('{"message":"Não é possível gerar um token.", "statusCode":500}');
    } else {
      Write('{"token":"' + token + '", "statusCode": 200}');
    }

    function isEmpty(str) {
      return !str || 0 === str.length;
    }
</script>