import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../../../components";
import { type FormValues, schema } from "../../schema";

import "./styles.scss";

interface TypeCodeinterface {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
  setStep: (step: "home" | "type" | "scan" | "userData") => void;
}

export const TypeCode = ({ onSubmit, isLoading, setStep }: TypeCodeinterface) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });

  return (
    <div className="type_code">
      <div className="type_code_header">
        <h2>CHECK-IN</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="type_code_form">
        <div className={`type_code_input_container${errors.code ? " error" : ""}`}>
          <input
            type="text"
            placeholder="INSERIR CÓDIGO"
            className={`type_code_input${errors.code ? " error" : ""}`}
            {...register("code")}
            autoComplete="off"
          />
          {errors.code && (
            <>
              <span className="type_code_input_error_icon">&#10006;</span>
              <p className="type_code_error_message">{errors.code.message}</p>
            </>
          )}
        </div>
        <div className="type_code_button_container">
          <Button text="VALIDAR" className="primary" type="submit" disabled={isLoading} />
          <Button text="Retornar" onClick={() => setStep("home")} className="white" />
        </div>
      </form>
    </div>
  );
};
