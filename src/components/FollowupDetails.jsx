
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { ArrowBack, CalendarToday, Person } from '@mui/icons-material';

const FollowupDetails = () => {
  const { ideaId, followupId } = useParams();
  const navigate = useNavigate();
  const [followup, setFollowup] = useState(null);

  useEffect(() => {
    // هنا يمكنك جلب تفاصيل المتابعة إذا كان هناك API
    // حالياً نعرض بيانات وهمية
    setFollowup({
      id: followupId,
      phase: 'month_1',
      scheduled_date: '2024-01-15',
      status: 'pending',
      active_users: 150,
      revenue: 5000,
      growth_rate: 25
    });
  }, [followupId]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/ideas/${ideaId}/post-launch-followups`)}
        sx={{ mb: 3 }}
      >
        العودة للمتابعات
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            تفاصيل المتابعة
          </Typography>
          
          {followup && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    المرحلة
                  </Typography>
                  <Typography variant="body1">
                    {followup.phase === 'month_1' ? 'الشهر الأول' : followup.phase}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    الحالة
                  </Typography>
                  <Chip
                    label={followup.status === 'pending' ? 'في الانتظار' : 'مكتمل'}
                    color={followup.status === 'pending' ? 'warning' : 'success'}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    المستخدمون النشطون
                  </Typography>
                  <Typography variant="h6">
                    {followup.active_users}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    الإيرادات
                  </Typography>
                  <Typography variant="h6">
                    {followup.revenue.toLocaleString()} ريال
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    معدل النمو
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={followup.growth_rate > 0 ? 'success.main' : 'error.main'}
                  >
                    {followup.growth_rate}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FollowupDetails;