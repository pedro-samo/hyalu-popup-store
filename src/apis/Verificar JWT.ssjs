<script runat="server" language="javascript">
    Platform.Load("Core", "1.1.5");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "*");
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
    Platform.Response.SetResponseHeader("Strict-Transport-Security", "max-age = 0, cache-control: private, no-cache  ");
    Platform.Response.SetResponseHeader("X-XSS-Protection", "1; mode=block");
    Platform.Response.SetResponseHeader("X-Frame-Options", "Deny");
    Platform.Response.SetResponseHeader("X-Content-Type-Options", "nosniff");
    Platform.Response.SetResponseHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    Platform.Response.SetResponseHeader("Content-Security-Policy", "default-src 'self'");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

    Platform.Function.ContentBlockByKey("dca-ssjs-lib");

    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);

    var token = payloadObj.token;

    if (!token) {
      Write('{"message":"Não autorizado.","statusCode":401}');
    } else {
      try {
        var cp = new cloudpage(),
            jwt = new jwt();

        var tokenValidated = jwt.verify(token, "64593477-b709-4271-b6c7-329915c1eaef");

        if (tokenValidated === true) {
           Write('{"message":"Sucesso!","statusCode":200}')
        } else {
           Write('{"message":"Falha na validação do token.","details":' + Stringify(tokenValidated) + '}');
        }
      } catch (err) {
          Write('{"message":"Ocorreu um erro durante a verificação do token.","error":' + Stringify(err) + '}');
      }
    }
</script>
