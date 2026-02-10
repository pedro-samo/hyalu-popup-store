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

    try {
      // Receiving data from POST request
      var payload = Platform.Request.GetPostData();
      var payloadObj = Platform.Function.ParseJSON(payload);

      var email = payloadObj.fields.email;

      var brand = Platform.Request.GetQueryStringParameter("brand");

      var deAppointmentsKeys = {
        vichy: "3AF34049-298E-4030-9058-477A35FCF3DA", // tb_vichy_popup_store_appointments
        hyalu: "74206CBD-4294-46EC-898C-C7F7CD713117" // tb_lrp_hyalu_popup_store_appointments
      };

      var DE = deAppointmentsKeys[brand];

      var filter = {
        Property: "email",
        SimpleOperator: "equals",
        Value: email
      };

      if (email) {
        var myDE = DataExtension.Init(DE);

        // Retrieve the row by email
        var rows = myDE.Rows.Retrieve(filter);
        if (rows && rows.length > 0) {
          var currentCheckin = rows[0].checkin;
          if (currentCheckin === "True") {
            Write(
              '{"message":"Check-in já realizado anteriormente.","statusCode": 409}'
            );
          } else {
            // Attempt to update the record in the Data Extension
            var rowsUpdated = myDE.Rows.Update(
              { checkin: "True" },
              ["email"],
              [email]
            );
            if (rowsUpdated > 0) {
              Write(
                '{"message":"Check-in realizado com sucesso.","statusCode": 200}'
              );
            } else {
              Write(
                '{"message":"Falha ao atualizar o check-in.","statusCode": 500}'
              );
            }
          }
        } else {
          Write(
            '{"message":"Nenhum dado foi encontrado por email: ' +
              email +
              '","statusCode": 404}'
          );
        }
      } else {
        Write('{"message":"Email não enviado.","statusCode": 400}');
      }
    } catch (e) {
      Write(
        '{"message":"Um erro aconteceu ao atualizar a Data Extension. Message: ' +
          e.message +
          '","statusCode": 500}'
      );
    }
</script>