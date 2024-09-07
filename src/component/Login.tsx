import { FormEvent, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

type LoginProps = {
  onIdSubmit: (id: string) => void;
};

function Login({ onIdSubmit }: LoginProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function createNewId() {
    const newId = uuidv4();
    onIdSubmit(newId);
    inputRef.current!.value = "";
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onIdSubmit(inputRef.current!.value);
    inputRef.current!.value = "";
  }

  return (
    <Container
      className="d-flex align-items-center"
      style={{ height: "100dvh" }}
    >
      <Form className="w-100" onSubmit={(e) => handleSubmit(e)}>
        <Form.Group>
          <Form.Label>Enter your ID</Form.Label>
          <Form.Control type="text" ref={inputRef} required></Form.Control>
        </Form.Group>

        <Button type="submit" className="mr-2">
          Login
        </Button>
        <Button variant="secondary" className="ml-2" onClick={createNewId}>
          Create New Id
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
