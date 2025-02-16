package org.cms.Utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatter {
    private static DateFormatter mInstance;
    private static SimpleDateFormat mSimpleDateFormat;

    public DateFormatter() {
        mSimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }

    public static DateFormatter getInstance() {
        if(mInstance == null)
            mInstance = new DateFormatter();

        return mInstance;
    }

    public String format(Date date) {
        return mSimpleDateFormat.format(date);
    }
}
