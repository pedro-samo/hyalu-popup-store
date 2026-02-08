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

    var fields = payloadObj.fields;

    var deNames = {
      vichy: "tb_vichy_popup_store_appointments",
      kerastase: "tb_kerastase_popup_store_users"
    };

    var deName = deNames[brand];

    if (payloadObj.action && payloadObj.action == "remove" && fields.email) {
      try {
        var de = DataExtension.Init(deName);
        var deletedCount = de.Rows.Remove(["email"], [fields.email]);
        if (deletedCount > 0) {
          // --- JWT Token Logic ---
          var objReturned = {
            email: fields.email,
            name: fields.nome,
            lastName: fields.sobrenome,
            token: fields.token,
            appointment: null
          };

          try {
            var cp = new cloudpage(),
              jwt = new jwt();
            var jwtPayload = {
              iss: getPageUrl(false),
              user: objReturned
            };
            var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
            var token = jwt.encode("HS256", keyName, jwtPayload, 60 * 60 * 24);

            Write('{"token":' + Stringify(token) + ', "statusCode":200}');
          } catch (err) {
            Write(
              '{"message":"Erro ao gerar token.","statusCode":500,"error":' +
                Stringify(err) +
                "}"
            );
          }
        } else {
          Write(
            '{"message":"Nenhum agendamento encontrado para esse e-mail.","statusCode": 404}'
          );
        }
      } catch (err) {
        Write(
          '{"message":"Erro ao remover agendamento.","statusCode": 500,"error":' +
            Stringify(err) +
            "}"
        );
      }
    }
    // Update flow
    else if (payloadObj.action && payloadObj.action == "update" && fields.email) {
      try {
        var de = DataExtension.Init(deName);
        var removed = de.Rows.Remove(["email"], [fields.email]);
        if (removed > 0) {
          var TSD = TriggeredSend.Init("124279");
          var Status = TSD.Send(fields.email, fields);

          if (Status != "OK") {
            Write(
              '{"message":"Não foi possível enviar o e-mail.","statusCode": 404,"details":' +
                Stringify(Status) +
                "}"
            );
          } else {
            // --- JWT Token Logic ---
            var objReturned = {
              email: fields.email,
              name: fields.nome,
              lastName: fields.sobrenome,
              token: fields.token,
              appointment: fields.dataHorario
            };

            try {
              var cp = new cloudpage(),
                jwt = new jwt();
              var jwtPayload = {
                iss: getPageUrl(false),
                user: objReturned
              };
              var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
              var token = jwt.encode("HS256", keyName, jwtPayload, 60 * 60 * 24);

              Write('{"token":' + Stringify(token) + ', "statusCode":200}');
            } catch (err) {
              Write(
                '{"message":"Erro ao gerar token.","statusCode":500,"error":' +
                  Stringify(err) +
                  "}"
              );
            }
          }
        } else {
          Write(
            '{"message":"Nenhum agendamento encontrado para esse e-mail.","statusCode": 404}'
          );
        }
      } catch (err) {
        Write(
          '{"message":"Erro ao atualizar agendamento.","statusCode": 500,"error":' +
            Stringify(err) +
            "}"
        );
      }
    }
    // Insert flow (same as add)
    else if (
      (payloadObj.action && payloadObj.action == "insert" && fields.email) ||
      (!payloadObj.action && fields.email)
    ) {
      try {
        var de = DataExtension.Init(deName);

        var existingEmail = de.Rows.Lookup(["email"], [fields.email]);
        if (existingEmail.length > 0) {
          Write(
            '{"message":"Já existe um agendamento para esse e-mail.","statusCode": 409}'
          );
        } else {
          try {
            var TSD = TriggeredSend.Init("124279");
            var Status = TSD.Send(fields.email, fields);

            if (Status != "OK") {
              Write(
                '{"message":"Não foi possível enviar o e-mail.","statusCode": 404}'
              );
            } else {
              // --- JWT Token Logic ---
              var objReturned = {
                email: fields.email,
                name: fields.nome,
                lastName: fields.sobrenome,
                token: fields.token,
                appointment: fields.dataHorario
              };

              try {
                var cp = new cloudpage(),
                  jwt = new jwt();
                var jwtPayload = {
                  iss: getPageUrl(false),
                  user: objReturned
                };
                var keyName = "64593477-b709-4271-b6c7-329915c1eaef";
                var token = jwt.encode("HS256", keyName, jwtPayload, 60 * 60 * 24);

                Write('{"token":' + Stringify(token) + ', "statusCode":200}');
              } catch (err) {
                Write(
                  '{"message":"Erro ao gerar token.","statusCode":500,"error":' +
                    Stringify(err) +
                    "}"
                );
              }
            }
            // --- End JWT Token Logic ---
          } catch (err) {
            Write(
              '{"message":"Erro ao adicionar dados.","statusCode": 500,"error":' +
                Stringify(err) +
                "}"
            );
          }
        }
      } catch (err) {
        Write(
          '{"message":"Não foi possível consultar as informações.","statusCode": 500}'
        );
      }
    } else {
      Write(
        '{"message":"Campo Email inválido ou não encontradoo.","statusCode": 400}'
      );
    }
</script>