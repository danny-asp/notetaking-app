
import { createTheme, ThemeProvider } from '@mui/material';
import { useStore } from '../App';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';



const defaultTheme = createTheme();

const HomeScreen = () => {
  const { state } = useStore();
  
  
  return (
    <ThemeProvider theme={defaultTheme}>
      {state.userNotes.length>0 ? (<VerticalTimeline layout="1-column-left">
        {state.userNotes.map((note)=>{
          return(
            <VerticalTimelineElement
            key={note.title}
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(12, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            style={{minWidth:150}}
    
      >
      <h3 className="vertical-timeline-element-title" style={{minWidth:150}}>{note.title}</h3>
    
      <p style={{minWidth:150}}>
        {note.content}
      </p>
      </VerticalTimelineElement>
          )
        })}
</VerticalTimeline>) : state.loggedInUser ? "You still have no added notes" : "Please, register or login"}
      
      
    </ThemeProvider>
    
  )
}

export default HomeScreen
