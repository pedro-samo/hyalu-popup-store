<script runat="server" language="javascript">
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

    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);
    var brand = Platform.Request.GetQueryStringParameter("brand");

    var fields = payloadObj.fields;

    var deUsersKeys = {
      vichy: {
        user: "3CF3C7B7-8EC5-4A47-A008-C99BF672ED3E",
        appointment: "3AF34049-298E-4030-9058-477A35FCF3DA"
      },
      hyalu: {
        user: "02C2DBFB-5621-4055-8A2A-51E5F74C2F59",
        appointment: "E331669A-B5AD-4397-89BA-295F4C85164D"
      }
    };

    var DE = deUsersKeys[brand];

    var hashedPassword = null;
    if (fields.senha && fields.senha != null && fields.senha != "") {
      var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
      var senhaString = "" + fields.senha;
      var saltedPassword = senhaString + keyName + senhaString;
      hashedPassword = Platform.Function.MD5(saltedPassword);
    }

    var filter1 = {
      Property: "email",
      SimpleOperator: "equals",
      Value: fields.email
    };

    var complexFilter = {
      LeftOperand: {
        Property: "email",
        SimpleOperator: "equals",
        Value: fields.email
      },
      LogicalOperator: "AND",
      RightOperand: {
        Property: "senha",
        SimpleOperator: "equals",
        Value: hashedPassword
      }
    };

    var DE_USER = DataExtension.Init(DE.user);
    var validateLogin = DE_USER.Rows.Retrieve(complexFilter);
    var validateLoginExists = DE_USER.Rows.Retrieve(filter1);

    if (fields.email.length > 0 && validateLoginExists.length == 0) {
      Write(
        '{"message":"E-mail não cadastrado. Clique em Cadastre-se.","statusCode":401}'
      );
    } else if (
      fields.email.length > 0 &&
      validateLoginExists.length > 0 &&
      validateLogin.length == 0
    ) {
      Write('{"message":"A senha está incorreta.","statusCode":401}');
    } else if (fields.email.length > 0 && validateLogin.length > 0) {
      var DE_APPOINTMENTS = DataExtension.Init(DE.appointment);

      var filter1 = {
        Property: "email",
        SimpleOperator: "equals",
        Value: fields.email
      };

      var validateAppointmentExists = DE_APPOINTMENTS.Rows.Retrieve(filter1);

      var objReturned = {
        email: validateLogin[0].email,
        name: validateLogin[0].nome,
        lastName: validateLogin[0].sobrenome,
        token: validateLogin[0].token,
        appointment:
          validateAppointmentExists.length > 0
            ? validateAppointmentExists[0].dataHorario
            : null
      };

      Platform.Function.ContentBlockByKey("dca-ssjs-lib");

      try {
        var jwt = new jwt();

        var payload = {
          iss: getPageUrl(false), // issuer of the token
          user: objReturned
        };

        var keyName = "64593477-b709-4271-b6c7-329915c1eaef";

        var token = jwt.encode("HS256", keyName, payload, 60 * 60 * 24);

        Write('{"token":' + Stringify(token) + ', "statusCode":200}');
      } catch (err) {
        Write('{"message":' + Stringify(err) + ', "statusCode":500}');
      }
    } else {
      Write('{"message":"Usuãrio não autorizado","statusCode":401}');
    }
</script>