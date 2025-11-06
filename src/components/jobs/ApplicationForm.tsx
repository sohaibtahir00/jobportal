"use client";

interface ApplicationFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  jobTitle?: string;
  companyName?: string;
  jobId?: string;
}

export default function ApplicationForm(props: ApplicationFormProps) {
  if (!props.isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Apply for {props.jobTitle}</h2>
        <p className="mb-4">at {props.companyName}</p>
        <p className="text-gray-600">Application form under construction. Authentication is working!</p>
        <button
          onClick={props.onClose}
          className="mt-6 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
