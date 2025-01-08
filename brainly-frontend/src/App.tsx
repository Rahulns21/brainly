import './App.css'
import { Button } from './components/ui/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'

function App() {
  return (
    <>
      <Button title="Submit" size="sm" variant="secondary"
      startIcon={<PlusIcon size="md" />} 
      endIcon={<ShareIcon size="md" />} />
      &nbsp;

      <Button title="Share" size="md" variant="secondary"
      startIcon={<PlusIcon size="md" />} 
      endIcon={<ShareIcon size="md" />} />
      &nbsp;
      
      <Button title="Save" size="lg" variant="primary"
      startIcon={<PlusIcon size="lg" />} 
      endIcon={<ShareIcon size="lg" />} />
    </>
  )
}

export default App
