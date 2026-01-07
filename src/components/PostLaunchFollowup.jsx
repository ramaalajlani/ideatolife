import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Edit,
  Visibility,
  CalendarToday,
  People,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import postLaunchService from "/src/services/postLaunchService";
import LoadingSpinner from "./common/LoadingSpinner";

const PostLaunchFollowup = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState([]);
  const [idea, setIdea] = useState(null);
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [ownerData, setOwnerData] = useState({
    active_users: '',
    revenue: '',
    growth_rate: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchFollowups();
  }, [ideaId]);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      const response = await postLaunchService.getIdeaFollowups(ideaId);
      setFollowups(response.data);
      setIdea(response.idea);
    } catch (error) {
      console.error('Error fetching followups:', error);
      showSnackbar(error.message || 'فشل في تحميل المتابعات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateDialog = (followupItem) => {
    const followup = followupItem.followup;
    const today = new Date();
    const scheduledDate = new Date(followup.scheduled_date);
    
    // التحقق من الشروط (مثل الباك)
    if (today < scheduledDate) {
      showSnackbar('لا يمكن تحديث المتابعة قبل موعدها المحدد', 'warning');
      return;
    }
    
    if (followup.status === 'done') {
      showSnackbar('لا يمكن تعديل متابعة منتهية', 'warning');
      return;
    }
    
    setSelectedFollowup(followupItem);
    setOwnerData({
      active_users: followup.active_users || '',
      revenue: followup.revenue || '',
      growth_rate: followup.growth_rate || ''
    });
    setOpenUpdateDialog(true);
  };

  const handleSubmitUpdate = async () => {
    try {
      // التحقق من البيانات قبل الإرسال
      const validationErrors = [];
      
      if (ownerData.active_users && ownerData.active_users < 0) {
        validationErrors.push('عدد المستخدمين يجب أن يكون أكبر من أو يساوي 0');
      }
      
      if (ownerData.revenue && ownerData.revenue < 0) {
        validationErrors.push('الإيرادات يجب أن تكون أكبر من أو تساوي 0');
      }
      
      if (ownerData.growth_rate && (ownerData.growth_rate < -100 || ownerData.growth_rate > 100)) {
        validationErrors.push('معدل النمو يجب أن يكون بين -100 و 100');
      }
      
      if (validationErrors.length > 0) {
        showSnackbar(validationErrors.join(', '), 'error');
        return;
      }
      
      // إرسال البيانات للباك
      const response = await postLaunchService.updateFollowupByOwner(
        selectedFollowup.followup.id,
        ownerData
      );
      
      showSnackbar(response.message || 'تم تحديث البيانات بنجاح', 'success');
      setOpenUpdateDialog(false);
      fetchFollowups(); // تحديث القائمة
    } catch (error) {
      console.error('Error updating followup:', error);
      showSnackbar(error.message || 'فشل في تحديث البيانات', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'done': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const canUpdateFollowup = (followup) => {
    const today = new Date();
    const scheduledDate = new Date(followup.scheduled_date);
    
    // نفس شروط الباك
    return today >= scheduledDate && followup.status !== 'done';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* شريط التنقل */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/ideas/${ideaId}`)}
        >
          العودة للفكرة
        </Button>
        
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          متابعات ما بعد الإطلاق
        </Typography>
      </Box>

      {/* معلومات الفكرة */}
      {idea && (
        <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {idea.title}
            </Typography>
            <Typography variant="body2">
              إجمالي المتابعات: {followups.length}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* قائمة المتابعات */}
      <Grid container spacing={3}>
        {followups.map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* رأس البطاقة */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={postLaunchService.getPhaseLabel(item.followup.phase)}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={postLaunchService.getStatusText(item.followup.status)}
                    color={getStatusColor(item.followup.status)}
                    size="small"
                  />
                </Box>

                {/* تاريخ المتابعة */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {postLaunchService.formatDate(item.followup.scheduled_date)}
                  </Typography>
                </Box>

                {/* بيانات المتابعة */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Tooltip title="المستخدمون النشطون">
                      <Box sx={{ textAlign: 'center' }}>
                        <People sx={{ color: 'info.main', mb: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          المستخدمون
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {item.followup.active_users || '-'}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Tooltip title="الإيرادات">
                      <Box sx={{ textAlign: 'center' }}>
                        <AttachMoney sx={{ color: 'success.main', mb: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          الإيرادات
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {item.followup.revenue ? 
                            postLaunchService.formatCurrency(item.followup.revenue) : 
                            '-'
                          }
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Tooltip title="معدل النمو">
                      <Box sx={{ textAlign: 'center' }}>
                        <TrendingUp 
                          sx={{ 
                            color: item.followup.growth_rate > 0 ? 'success.main' : 'error.main', 
                            mb: 0.5 
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          النمو %
                        </Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="medium"
                          color={item.followup.growth_rate > 0 ? 'success.main' : 'error.main'}
                        >
                          {item.followup.growth_rate ? `${item.followup.growth_rate}%` : '-'}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>

                {/* حالة الأداء إذا كانت متوفرة */}
                {item.followup.performance_status && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      حالة الأداء:
                    </Typography>
                    <Chip 
                      label={item.followup.performance_status}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                )}

                {/* قرار اللجنة إذا كان متوفراً */}
                {item.followup.committee_decision && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      قرار اللجنة:
                    </Typography>
                    <Chip 
                      label={item.followup.committee_decision}
                      size="small"
                      color={
                        item.followup.committee_decision === 'graduate' ? 'success' :
                        item.followup.committee_decision === 'terminate' ? 'error' :
                        'primary'
                      }
                    />
                  </Box>
                )}

                {/* الأزرار */}
                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/ideas/${ideaId}/followup/${item.followup.id}`)}
                    sx={{ flexGrow: 1 }}
                  >
                    التفاصيل
                  </Button>
                  
                  {canUpdateFollowup(item.followup) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleOpenUpdateDialog(item)}
                      sx={{ flexGrow: 1 }}
                    >
                      تحديث البيانات
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* رسالة إذا لم تكن هناك متابعات */}
      {!loading && followups.length === 0 && (
        <Card sx={{ textAlign: 'center', p: 4, mt: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            لا توجد متابعات بعد
          </Typography>
          <Typography variant="body2" color="textSecondary">
            سيتم إنشاء متابعات ما بعد الإطلاق تلقائياً بعد إطلاق الفكرة.
          </Typography>
        </Card>
      )}

      {/* ديالوج تحديث البيانات */}
      <Dialog 
        open={openUpdateDialog} 
        onClose={() => setOpenUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Edit />
            تحديث بيانات المتابعة
          </Box>
          {selectedFollowup && (
            <Typography variant="body2" color="textSecondary">
              المرحلة: {postLaunchService.getPhaseLabel(selectedFollowup.followup.phase)}
            </Typography>
          )}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="عدد المستخدمين النشطين"
              type="number"
              fullWidth
              value={ownerData.active_users}
              onChange={(e) => setOwnerData({
                ...ownerData,
                active_users: e.target.value ? parseInt(e.target.value) : ''
              })}
              margin="normal"
              helperText="يجب أن يكون عدد صحيح موجب"
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <TextField
              label="الإيرادات (ريال)"
              type="number"
              fullWidth
              value={ownerData.revenue}
              onChange={(e) => setOwnerData({
                ...ownerData,
                revenue: e.target.value ? parseFloat(e.target.value) : ''
              })}
              margin="normal"
              helperText="يجب أن تكون قيمة موجبة"
              InputProps={{ inputProps: { min: 0, step: "0.01" } }}
            />
            
            <TextField
              label="معدل النمو (%)"
              type="number"
              fullWidth
              value={ownerData.growth_rate}
              onChange={(e) => setOwnerData({
                ...ownerData,
                growth_rate: e.target.value ? parseFloat(e.target.value) : ''
              })}
              margin="normal"
              helperText="من -100 إلى 100"
              InputProps={{ inputProps: { min: -100, max: 100, step: "0.1" } }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="inherit">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmitUpdate} 
            variant="contained"
            color="primary"
          >
            حفظ التحديثات
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostLaunchFollowup;