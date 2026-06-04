'use client';
import { useEffect, useState } from 'react';
import Step2Old from "../../components/step2/index-v1";
import Step2New from "../../components/step2/index-v2";

const Step2Page = () => {
    const [isPriceTest, setIsPriceTest] = useState(false);

    useEffect(() => {
        setIsPriceTest(localStorage.getItem('ab_variant') === 'price_test');
    }, []);

    return (
        <div>
            {isPriceTest ? <Step2New /> : <Step2Old />}
        </div>
    );
};

export default Step2Page;
