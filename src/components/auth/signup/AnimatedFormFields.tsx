
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues, LoginFormValues } from "../types";
import { EmailField } from "../form-fields/EmailField";
import { PasswordField } from "../form-fields/PasswordField";
import { DateOfBirthField } from "../form-fields/DateOfBirthField";
import { UsernameField } from "../form-fields/UsernameField";
import { CountrySelect } from "../form-fields/CountrySelect";

interface AnimatedFormFieldsProps {
  form: UseFormReturn<SignupFormValues> | UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  isLoginMode?: boolean;
}

export const AnimatedFormFields = ({ form, isLoading, isLoginMode = false }: AnimatedFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <EmailField form={form} isLoading={isLoading} />
      </motion.div>
      
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <PasswordField
          form={form}
          name="password"
          placeholder="Password"
          isLoading={isLoading}
        />
        {!isLoginMode && (
          <PasswordField
            form={form}
            name="confirmPassword"
            placeholder="Confirm Password"
            isLoading={isLoading}
          />
        )}
      </motion.div>

      {!isLoginMode && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <UsernameField form={form} isLoading={isLoading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <DateOfBirthField form={form} isLoading={isLoading} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <CountrySelect form={form} isLoading={isLoading} />
          </motion.div>
        </>
      )}
    </div>
  );
};
