import { useState } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        props.login(credentials);
    };

    return (
        <Form className='mt-5' onSubmit={handleSubmit}>
            <FloatingLabel controlId="username" label="Email address" className="login-form">
                <Form.Control type="email" placeholder="name@example.com" value={username} onChange={ev => setUsername(ev.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password" className="login-form">
                <Form.Control type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} required maxLength={40}/>
            </FloatingLabel>
            <Button type="submit" size='md'>Login</Button>
        </Form>
    )
};

export { LoginForm };