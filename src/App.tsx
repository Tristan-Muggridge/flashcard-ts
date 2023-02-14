import './App.css'
import DataContext, { FirebaseData, LocalData } from './context/DataContext';
import TestComponent from './TestComponent';

function App() {
  return (
    <div className="App">
      	<DataContext.Provider value={ LocalData }>
			<h1> From LocalData </h1>
			<TestComponent />
		</DataContext.Provider>
      	<DataContext.Provider value={ FirebaseData }>
			<h1> From Firebase </h1>
			<TestComponent />
		</DataContext.Provider>
    </div>
  )
}

export default App
