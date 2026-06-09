'use client';
import Step2Old from "../../components/step2/index-v1";
import Step2New from "../../components/step2/index-v2";

const Step2Page = () => {
    const isPriceTest = true;
    return (
        <div>
            {isPriceTest ? <Step2New /> : <Step2Old />}
        </div>
    );
};

export default Step2Page;
