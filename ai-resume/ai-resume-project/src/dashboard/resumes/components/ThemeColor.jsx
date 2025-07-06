import React, {useContext} from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

export const ThemeColor = () => {
     const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
        "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
        "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
        "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
    ];

    const ColorSelect = (color)=>{
        setResumeInfo({
            ...ResumeInfo,
            themeColor: color
        })
    }
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='outline' size='sm' className='flex gap-2'>
                        <span className="flex items-center gap-2">
                            <LayoutGrid /> Theme
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <h2 className='mb-2 text-sm font-bold'>Select Theme Color</h2>
                    <div className='grid grid-cols-5 gap-3'>
                        {colors.map((items,index)=>(
                            <div className='h-5 w-5 rounded-full cursor-pointer hover:border-black border'
                            onClick={()=>ColorSelect(items)}
                            style={{
                                background:items
                            }}>

                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
