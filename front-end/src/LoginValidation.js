function Validation(values)
{
    let error = {}
    
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    /* const password_pattern = /^(?=.*\d) (?=.*[az]) (?=.*[A-Z]) [a-zA-Z0-9]{8,}$/ */
    const password_pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    const name_pattern = /^[a-z ,.'-]+$/i

    if(values.email === "") 
    {
        error.email="Please Type Email.";
    }
    else if(!email_pattern.test(values.email))
    {
        error.email="Please Type Correct Email.";
    }
    else
    {
        error.email="";
    }

    if(values.password === "") 
    {
        error.password="Please Type Password.";
    }
    else if(!password_pattern.test(values.password))
    {
        error.password="Please Type Correct Password.";
    }
    else
    {
        error.password="";
    }

    if(values.name === "") 
    {
        error.name="Name Should Not Be Empty!";
    }
    else if(!name_pattern.test(values.name))
    {
        error.name="Name did not match!";
    }
    else
    {
        error.name="";
    }
    
    return error;
}

export default Validation;