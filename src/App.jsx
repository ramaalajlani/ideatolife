import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import SuccessStories from "./components/SuccessStories";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import RegisterPage from './pages/RegisterPage';
import LoginRoute from './pages/Login'; 
import Timeline from './components/Timeline/Timeline';
import ActiveSlider from './components/ActiveSlider';
import Navbar from './components/Navbar';
import Welcome from "./components/Welcome";
import ProfilePage from './pages/ProfilePage';
import BusinessModelCanvas from './components/BusinessModelCanvas';
import ReportsDashboard from './components/ReportsDashboard/ReportsDashboard';
import MeetingCalendar from './components/MeetingCalendar';
import LayoutWrapper from './components/LayoutWrapper';
import IdeaSubmissionForm from './components/IdeaSubmissionForm';
import ProdifyLanding from './components/ProdifyLanding'; 
import IdeaEditForm from './components/IdeaEditForm';
import BMCGridEdit from "./components/BusinessModelCanvas/BMCGridEdit";
import FundingRequestsCard from "./components/FundingCard";
import GanttFullPage from './pages/GanttFullPage';
import RegisterCommitteeMember from "./pages/dashboardcommit/CommitteeDashboard/RegisterCommitteeMember";
import LoginCommitteeMember from './pages/dashboardcommit/CommitteeDashboard/LoginCommitteeMember';
import PostLaunchFollowup from './components/PostLaunchFollowup'; 
import FollowupDetails from './components/FollowupDetails'; 
import CommitteeDashboard from "./pages/dashboardcommit/CommitteeDashboard";
import LaunchIdea from "./components/LaunchIdea";
import { IdeaProvider } from './context/IdeaContext';


const App = () => {
  return (
    <IdeaProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* الصفحة الرئيسية */}
            <Route path="/" element={
              <>
                <Navbar />
<div className="bg-gray-900 text-white min-h-screen">
  <section id="home" className="bg-white">
    <HeroSection />
  </section>

  <ActiveSlider />

  <section id="features">
    <FeatureSection />
  </section>

  <section id="workflow">
    <Workflow />
  </section>

  <section id="success-stories">
    <SuccessStories />
  </section>

  <section id="expert-committee">
    {/* هذا سيكون قسم الخبراء */}
    <Testimonials />
  </section>

  <Footer />
</div>
              </>
            } />

            {/* صفحات اللجنة */}
            <Route path="/committee-dashboard/:ideaId?" element={<CommitteeDashboard />} />
            <Route path="/committee/register" element={<RegisterCommitteeMember />} />
              <Route path="/login/committee-member" element={<LoginCommitteeMember />} />

            {/* صفحات المستخدم */}
      
            <Route path="/register" element={<RegisterPage />} />
                 <Route path="/login" element={<LoginRoute />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* مسارات الأفكار */}
            <Route path="/ideas/:ideaId/welcome" element={<Welcome />} />
            <Route path="/ideas/:ideaId/bmc/edit-grid" element={
              <LayoutWrapper activeItem="business-model">
                <BMCGridEdit />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/roadmap" element={
              <LayoutWrapper activeItem="roadmap">
                <Timeline />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/gantt" element={<GanttFullPage />} />
            <Route path="/ideas/:ideaId/reports" element={
              <LayoutWrapper activeItem="reports">
                <ReportsDashboard />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/business-model" element={
              <LayoutWrapper activeItem="business-model">
                <BusinessModelCanvas />
              </LayoutWrapper>
            } />
            <Route path="/submit-idea" element={
              <LayoutWrapper activeItem="submit-idea">
                <IdeaSubmissionForm />
              </LayoutWrapper> 
            } />
            <Route path="/ideas/:ideaId/edit" element={
              <LayoutWrapper activeItem="submit-idea">
                <IdeaEditForm />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/funding" element={
              <LayoutWrapper activeItem="funding">
                <FundingRequestsCard />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/meetings" element={
              <LayoutWrapper activeItem="meetings">
                <MeetingCalendar />
              </LayoutWrapper>
            } />
            <Route path="/ideas/:ideaId/launch" element={
              <LayoutWrapper activeItem="launch">
                <LaunchIdea />
              </LayoutWrapper>
            } />
            <Route path="/prodify" element={<ProdifyLanding />} />
            <Route path="/ideas/:ideaId/post-launch-followups" element={
  <LayoutWrapper activeItem="post-launch-followups">
    <PostLaunchFollowup />
  </LayoutWrapper>
} />
            

            {/* صفحة 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Navbar />
                <div className="text-center py-20 mt-20">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">الصفحة التي تبحث عنها غير موجودة</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    العودة للرئيسية
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </IdeaProvider>
  );
};

export default App;