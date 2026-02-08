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

    Platform.Function.ContentBlockByKey("dca-ssjs-lib");

    var payload = Platform.Request.GetPostData("utf-8");
    var payloadObj = Platform.Function.ParseJSON(payload);
    var brand = Platform.Request.GetQueryStringParameter("brand");

    var fields = payloadObj.fields;

    var deNames = {
      vichy: "tb_vichy_popup_store_users",
      kerastase: "tb_kerastase_popup_store_users"
    };

    var deName = deNames[brand];

    if (fields && fields.email && deName) {
      var de = DataExtension.Init(deName);
      var existingEmail = de.Rows.Lookup(["email"], [fields.email]);

      if (existingEmail.length > 0) {
        Write('{"message":"Email já cadastrado.","statusCode":409}');
      } else {
        try {
          var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
          var senhaString = "" + fields.senha;
          var saltedPassword = senhaString + keyName + senhaString;
          var hashedPassword = Platform.Function.MD5(saltedPassword);
          fields.senha = hashedPassword;

          de.Rows.Add(fields);

          var objReturned = {
            email: fields.email,
            name: fields.nome,
            lastName: fields.sobrenome,
            token: fields.token,
            appointment: ""
          };

          try {
            var cp = new cloudpage(),
              jwtHelper = new jwt();
            var jwtPayload = {
              iss: getPageUrl(false),
              user: objReturned
            };
            var token = jwtHelper.encode(
              "HS256",
              keyName,
              jwtPayload,
              60 * 60 * 24
            );

            Write('{"token":' + Stringify(token) + ', "statusCode":200}');
          } catch (err) {
            Write(
              '{"message":"Erro ao gerar token.","statusCode":500,"error":"' +
                String(err.message || err) +
                '"}'
            );
          }
        } catch (err) {
          Write(
            '{"message":"Erro ao adicionar dados.","statusCode":500,"error":"' +
              String(err.message || err) +
              '"}'
          );
        }
      }
    } else {
      Write(
        '{"message":"Campo brand ou email inválido.","statusCode":400,"brand":"' +
          brand +
          '","deName":"' +
          deName +
          '","hasFields":' +
          (fields != null) +
          "}"
      );
    }
</script>