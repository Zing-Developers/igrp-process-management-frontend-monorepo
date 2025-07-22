import { getProcesses } from '@igrp/platform-process-management-client-ts';

const App = () => {
  const processes = getProcesses();

  return (
    <div>
      <h1>Processos</h1>
      <ul>
        {processes.map((p) => (
          <li key={p.id}>
            {p.name} - <strong>{p.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;