<script runat="server">
    Platform.Load("Core", "1.1.5");

    // CORS headers
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS"
    );
    Platform.Response.SetResponseHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    Platform.Response.SetResponseHeader("Access-Control-Allow-Credentials", "true");

    // Security headers
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure; HttpOnly");
    Platform.Response.SetResponseHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    Platform.Response.SetResponseHeader("X-XSS-Protection", "1; mode=block");
    Platform.Response.SetResponseHeader("X-Frame-Options", "DENY");
    Platform.Response.SetResponseHeader("X-Content-Type-Options", "nosniff");
    Platform.Response.SetResponseHeader(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    Platform.Response.SetResponseHeader(
      "Content-Security-Policy",
      "default-src 'self'"
    );

    Platform.Function.ContentBlockByKey("dca-ssjs-lib");

    var payload = Platform.Request.GetPostData("utf-8");
    var payloadObj = Platform.Function.ParseJSON(payload);
    var brand = Platform.Request.GetQueryStringParameter("brand");

    var resetToken = payloadObj.token;
    var newPassword = payloadObj.newPassword;

    var deNames = {
      vichy: "tb_vichy_popup_store_users",
      hyalu: "tb_lrp_hyalu_popup_store_users"
    };

    var deName = deNames[brand];

    if (!resetToken || !newPassword) {
      Write('{"message":"Token e senha são obrigatórios.","statusCode": 400}');
      return;
    }

    try {
      var jwt = new jwt();
      var keyName = "64593477-b709-4271-b6c7-329915c1eaef";

      var decoded = jwt.verify(resetToken, keyName);

      if (decoded !== true) {
        Write(
          '{"message":"Token inválido ou expirado.","statusCode": 401, "details":' +
            Stringify(decoded) +
            "}"
        );
        return;
      }

      var parts = resetToken.split(".");
      if (parts.length !== 3) {
        Write('{"message":"Formato de token inválido.","statusCode": 401}');
        return;
      }

      var payloadBase64 = parts[1];
      while (payloadBase64.length % 4 !== 0) {
        payloadBase64 += "=";
      }

      var payloadJson = Platform.Function.Base64Decode(payloadBase64);
      var payload = Platform.Function.ParseJSON(payloadJson);

      if (!payload || !payload.email || payload.purpose !== "password-reset") {
        Write('{"message":"Token inválido ou expirado.","statusCode": 401}');
        return;
      }

      var email = payload.email;

      var senhaString = "" + newPassword;
      var saltedPassword = senhaString + keyName + senhaString;
      var hashedPassword = Platform.Function.MD5(saltedPassword);

      var de = DataExtension.Init(deName);

      var existingUser = de.Rows.Lookup(["email"], [email]);

      if (existingUser.length === 0) {
        Write('{"message":"Usuário não encontrado.","statusCode": 404}');
        return;
      }

      var updateData = {
        email: email,
        senha: hashedPassword
      };

      var updateResult = de.Rows.Update(updateData, ["email"], [email]);

      if (updateResult) {
        Write('{"message":"Senha redefinida com sucesso.","statusCode": 200}');
      } else {
        Write('{"message":"Erro ao atualizar senha.","statusCode": 500}');
      }
    } catch (err) {
      Write(
        '{"message":"Erro ao processar redefinição de senha.","statusCode": 500, "error":' +
          Stringify(err) +
          "}"
      );
    }
</script>