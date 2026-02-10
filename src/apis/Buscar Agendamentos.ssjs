<script runat="server">
    Platform.Load("core", "1.1.1");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Methods", "POST");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Origin", "*");
    Platform.Response.SetResponseHeader("Access-Control-Allow-Headers", "*");
    Platform.Response.SetResponseHeader("Set-Cookie", "Secure");
    Platform.Response.SetResponseHeader(
      "Strict-Transport-Security",
      "max-age=0, cache-control: private, no-cache"
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

    var payload = Platform.Request.GetPostData();
    var payloadObj = Platform.Function.ParseJSON(payload);

    var brand = Platform.Request.GetQueryStringParameter("brand");

    var fields = payloadObj.fields;

    var deNames = {
      vichy: "tb_vichy_popup_store_appointments",
      hyalu: "tb_lrp_hyalu_popup_store_appointments"
    };

    var deName = deNames[brand];

    try {
      var de = DataExtension.Init(deName);
      var existingAppointments = de.Rows.Lookup(["dia"], [fields.day]);

      var hourMap = {};
      if (existingAppointments && existingAppointments.length > 0) {
        for (var i = 0; i < existingAppointments.length; i++) {
          var hour = existingAppointments[i].hora;
          if (hourMap[hour]) {
            hourMap[hour]++;
          } else {
            hourMap[hour] = 1;
          }
        }
      }

      var result = [];
      for (var key in hourMap) {
        result.push({ hour: key, appointments: hourMap[key] });
      }

      Write('{"appointments":' + Stringify(result) + ', "statusCode":200}');
    } catch (err) {
      Write(
        '{"message":"Erro ao buscar agendamentos.","statusCode": 500,"error":' +
          Stringify(err) +
          "}"
      );
    }
</script>