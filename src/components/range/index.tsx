import { useEffect, useState } from "react";
import { useRange } from "react-instantsearch";
import { RangeInput } from "react-instantsearch";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { useLanguage } from "../../contexts/LanguageContext";

const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type HandleProps = {
    value: number;
    dragging: boolean;
    index: number;
}

export function RangeSlider(props: any) {
    console.log("RangeSlider props:", props);
    const { start, range, refine } = useRange(props);
    console.log("Range from useRange:", range);
    console.log("Start from useRange:", start);
    
    const { min, max, precision }: any = range;
    console.log("Min/Max extracted:", { min, max, precision });
    
    const [value, setValue] = useState({ start: min, end: max });
    const step = 1 / Math.pow(10, precision || 0);

    const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min);
    const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max);
    console.log("Calculated from/to:", { from, to });
    
    const { language } = useLanguage();
    const locale = language === 'ar' ? 'ar' : 'en';

    useEffect(() => {
        setValue({ start: from, end: to });
    }, [from, to]);

    // Show empty component if min and max are both 0 or if they're the same value
    if (min === 0 && max === 0 || min === max) {
        console.log("Range slider hidden due to invalid min/max values");
        return <div className="text-sm text-gray-500 py-2">Price range not available</div>;
    }

    // Ensure we have valid numeric values for the slider
    const sliderValue = [from || min, to || max];

    return (
        <div className="pb-4 w-full mt-4">
            <Slider
                handleRender={(node, handleProps: HandleProps) => (
                    <Tooltip
                        overlayInnerStyle={{ minHeight: "auto" }}
                        overlay={props?.attribute == 'modelYear' ? handleProps.value : `SAR ${numberWithCommas(handleProps.value)}`}
                        placement="bottom"
                    >
                        {node}
                    </Tooltip>
                )}
                range
                style={{
                    width: '90%',
                    margin: '0 auto'
                }}
                ariaLabelForHandle={["Minimum price", "Maximum price"]}
                onChange={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                        setValue({
                            start: value[0],
                            end: value[1]
                        });
                        refine([value[0], value[1]]);
                    }
                }}
                onChangeComplete={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                        refine([value[0], value[1]]);
                    }
                }}
                handleStyle={[{
                    borderColor: "#F28829",
                    height: 18,
                    width: 18,
                    opacity: 1,
                    backgroundColor: "#F28829",
                    top: 2
                }, {
                    borderColor: "#F28829",
                    height: 18,
                    width: 18,
                    opacity: 1,
                    backgroundColor: "#F28829",
                    top: 2
                }]}
                trackStyle={{ backgroundColor: "#F28829", height: 5 }}
                step={step}
                min={min}
                max={max}
                defaultValue={sliderValue}
            />

            <div className={'flex justify-between mt-4'}>
                <p className={'text-[10px] left-[0px] relative'}>{props?.attribute == 'modelYear' ? min : `SAR ${numberWithCommas(min)}`}</p>
                <p className={`text-[10px] ${locale === 'en' ? 'right-[40%] lg:right-[28%]' : 'right-[-40%] lg:right-[-25%]'} relative`}>{props?.attribute == 'modelYear' ? max : `SAR ${numberWithCommas(max)}`}</p>
            </div>
            
            <div className={'flex mt-2 justify-between'}>
                <RangeInput
                    attribute={props.attribute}
                    prefix={props?.attribute == 'modelYear' ? '' : "SAR"}
                    translations={{
                        separatorElementText: '',
                        submitButtonText: 'APPLY',
                    }}
                    classNames={{
                        input: 'border w-[48%] mr-1 p-1 rounded-md',
                        submit: "w-full lg:w-[98%] bg-main-bg p-2 rounded-md text-white mt-2",
                        separator: 'hidden',
                        form: 'w-full',
                        root: 'w-full'
                    }}
                />
            </div>
        </div>
    );
}
