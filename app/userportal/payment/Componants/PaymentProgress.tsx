export default function PaymentProgress({ currentStep }: any) {
  const steps = [1, 2, 3];

  return (
    <div className="flex justify-center items-center mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium
              ${step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <div className="w-16 h-1 bg-gray-200 mx-3" />
          )}
        </div>
      ))}
    </div>
  );
}
