# jQuery-SSN-Field-Masking

Digitalblush provides a nice play around plugin for masking the input fields. It can be used in application to provide the information about the format in which input expects the results, the good part is user only needs to worry about the value and rest of the stuff like formatting is taken care of, isn't it great!

Though, I did not find any good library which handles the formatting of user inputs as well as masking the user input with some special character which lead me to create this utility.

Social Security Number termed as SSN is quite sensitive information which is generally represented in XXX-XX-XXXX format. This utility combines the power of a password like field and handling the formatting of the user input. Majorly it is developed by keeping SSN like fields in mind though it could be used in other similar cases too.


You may achieve following key things from this utility:

1) Can define custom formatting for numbers be it XX-XXX-XXXX or XXX-XX-XXXX.

2) Can control the masked character that would be presented when user types in. It could be like 'X' or 'O'.

3) Behind the scenes this control retains the plain/raw SSN value which would be submitted to server, if required.

4) It is capable of formatting & masking the number if the input already holds a value. For ex: 123657891 may be converted to XXX-XX-7891 depending on the configuration.

5) It also handles the values if they are already masked. For ex: XXXXX1023 would be formatted as XXX-XX-1023 again as per the configuration of the utility.

6) To detect if the number is already masked before the utility took over the input field, we can define a numeric masked character equivalent. This is useful in cases where server already sends a masked value and this utility re-mask/formats that value, in such cases the masked character can be replaced by another numeric equivalent like '9'. It is helpful to identify if the available value was originally masked or not. For ex: XXXXX1023 is formatted as XXX-XX-1023 and it's submit value would be 999991023.



I will try to add further details to its configurations and features as I find time for it.

Hope it would be of any help.

Thanks!
