<script runat="server">
    Platform.Load("core", "1");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
    Platform.Response.SetResponseHeader(
      "Strict-Transport-Security",
      "max-age = 0, cache-control: private, no-cache "
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

    Platform.Function.ContentBlockByKey("dca-ssjs-lib");

    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);
    var brand = Platform.Request.GetQueryStringParameter("brand");

    var fields = payloadObj.fields;

    var deNames = {
      vichy: "tb_vichy_popup_store_users"
    };

    var deName = deNames[brand];

    try {
      var email = fields.email;

      if (!email) {
        Write('{"message":"E-mail não fornecido.","statusCode": 400}');
      } else {
        email = email.trim();

        var de = DataExtension.Init(deName);

        // Use Lookup method like Register.ssjs does
        var rows = de.Rows.Lookup(["email"], [email]);

        if (rows.length > 0) {
          try {
            var cp = new cloudpage(),
              jwt = new jwt();

            var jwtPayload = {
              iss: getPageUrl(false),
              email: email,
              purpose: "password-reset"
            };

            var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
            var resetToken = jwt.encode("HS256", keyName, jwtPayload, 60 * 60);

            var resetUrl =
              "https://cloud.crm.dermaclub.com.br/" +
              brand +
              "-popup-store?page=reset-password&token=" +
              resetToken;

            var fields = {
              email: email,
              resetUrl: resetUrl,
              resetToken: resetToken
            };

            var TSD = TriggeredSend.Init("124280");
            var Status = TSD.Send(email, fields);

            if (Status != "OK") {
              Write(
                '{"message":"Não foi possível enviar o e-mail.","statusCode": 404}'
              );
            } else {
              Write(
                '{"message":"E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.","statusCode": 200}'
              );
            }
          } catch (err) {
            Write(
              '{"message":"Erro ao processar solicitação.","statusCode": 500, "error":' +
                Stringify(err) +
                "}"
            );
          }
        } else {
          Write('{"message":"Usuário não cadastrado.","statusCode": 404}');
        }
      }
    } catch (err) {
      Write(
        '{"message":"Erro ao processar solicitação.","statusCode": 500, "error":' +
          Stringify(err) +
          "}"
      );
    }
</script>