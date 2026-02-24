<script runat="server" language="javascript">
    Platform.Load("Core", "1.1.5");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "*");
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
    Platform.Response.SetResponseHeader(
      "Strict-Transport-Security",
      "max-age = 0, cache-control: private, no-cache"
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

    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);

    var brand = Platform.Request.GetQueryStringParameter("brand");

    var deAppointmentsKeys = [
      "3AF34049-298E-4030-9058-477A35FCF3DA", // tb_vichy_popup_store_appointments
      "74206CBD-4294-46EC-898C-C7F7CD713117" // tb_lrp_hyalu_popup_store_appointments
    ];

    var token = payloadObj.fields ? payloadObj.fields.token : null;

    if (token && token.length > 0) {
      var filter = {
        Property: "token",
        SimpleOperator: "equals",
        Value: token
      };

      var userFiltered = null;

      for (var i = 0; i < deAppointmentsKeys.length; i++) {
        var DE = DataExtension.Init(deAppointmentsKeys[i]);
        var result = DE.Rows.Retrieve(filter);
        if (result.length > 0) {
          userFiltered = result;
          break;
        }
      }

      if (userFiltered && userFiltered.length > 0) {
        var objReturned = {
          email: userFiltered[0].email,
          name: userFiltered[0].nome,
          lastName: userFiltered[0].sobrenome,
          appointment: userFiltered[0].dataHorario
        };

        Write('{"data":' + Stringify(objReturned) + ',"statusCode": 200}');
      } else {
        Write('{"message":"Usuário sem agendamento","statusCode": 401}');
      }
    } else {
      Write(
        '{"message":"O token está faltando ou vazio novamente","statusCode": 400}'
      );
    }
</script>