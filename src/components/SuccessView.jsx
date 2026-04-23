import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const SuccessView = ({ title, message, onContinue, continueText = "Continue" }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {continueText}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessView;
