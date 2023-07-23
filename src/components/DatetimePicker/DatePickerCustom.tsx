import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

export default function DatePickerCustom({ defaultVal, handleChangeDate }: any) {
    const today = new Date();
    const [value, setValue] = useState(new Date(format(today, 'yyyy-MM-01')));
    const changeDate = (newVal: any) => {
        handleChangeDate(format(new Date(newVal), 'yyyy-MM-dd'));
        setValue(newVal);
    };

    useEffect(() => {
        setValue(new Date(defaultVal));
    }, [defaultVal]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                    sx={{
                        width: 135,
                        '& .MuiOutlinedInput-input': {
                            padding: '8.5px 8px'
                        },
                        '& .MuiOutlinedInput-root': {
                            fontSize: 14
                        },
                        '& .MuiSvgIcon-root': {
                            width: 14,
                            height: 14
                        }
                    }}
                    value={value}
                    onChange={(newVal) => changeDate(newVal)}
                />
            </LocalizationProvider>
        </>
    );
}
