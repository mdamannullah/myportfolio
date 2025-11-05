import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatMe from "./pages/ChatMe";
import ChatProjects from "./pages/ChatProjects";
import ChatSkills from "./pages/ChatSkills";
import ChatExperience from "./pages/ChatExperience";
import ChatEducation from "./pages/ChatEducation";
import ChatContact from "./pages/ChatContact";
import NotFound from "./pages/NotFound";
import { VoiceNavigator } from "./components/VoiceNavigator";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

/** Detect desktop based on width (>= 768px). */
function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isDesktop;
}

/** Cursor glow – auto-disabled on touch devices. */
const CursorGlow = () => {
  useEffect(() => {
    // bail out on touch devices (phones/tablets)
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.createElement("div");
    cursor.id = "cursor-glow";
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  return null;
};

const App = () => {
  const isDesktop = useIsDesktop(); // true on >=768px

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isDesktop && <CursorGlow />} {/* ← desktop only */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/me" element={<ChatMe />} />
            <Route path="/chat/projects" element={<ChatProjects />} />
            <Route path="/chat/skills" element={<ChatSkills />} />
            <Route path="/chat/experience" element={<ChatExperience />} />
            <Route path="/chat/education" element={<ChatEducation />} />
            <Route path="/chat/contact" element={<ChatContact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <VoiceNavigator />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;






// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import ChatMe from "./pages/ChatMe";
// import ChatProjects from "./pages/ChatProjects";
// import ChatSkills from "./pages/ChatSkills";
// import ChatExperience from "./pages/ChatExperience";
// import ChatEducation from "./pages/ChatEducation";
// import ChatContact from "./pages/ChatContact";
// import NotFound from "./pages/NotFound";
// import { VoiceNavigator } from "./components/VoiceNavigator";
// import { useEffect, useState } from "react";

// const queryClient = new QueryClient();

// const CursorGlow = () => {
//   useEffect(() => {
//     const cursor = document.createElement('div');
//     cursor.id = 'cursor-glow';
//     document.body.appendChild(cursor);

//     const moveCursor = (e: MouseEvent) => {
//       cursor.style.left = `${e.clientX}px`;
//       cursor.style.top = `${e.clientY}px`;
//     };

//     window.addEventListener('mousemove', moveCursor);

//     return () => {
//       window.removeEventListener('mousemove', moveCursor);
//       cursor.remove();
//     };
//   }, []);

//   return null;
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <CursorGlow />
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/chat/me" element={<ChatMe />} />
//           <Route path="/chat/projects" element={<ChatProjects />} />
//           <Route path="/chat/skills" element={<ChatSkills />} />
//           <Route path="/chat/experience" element={<ChatExperience />} />
//           <Route path="/chat/education" element={<ChatEducation />} />
//           <Route path="/chat/contact" element={<ChatContact />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//         <VoiceNavigator />
//       </Router>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
