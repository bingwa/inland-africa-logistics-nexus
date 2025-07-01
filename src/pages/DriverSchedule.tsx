
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Truck, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleItem {
  id: string;
  trip_number: string;
  origin: string;
  destination: string;
  planned_departure: string;
  planned_arrival: string;
  status: string;
  truck_number: string | null;
}

const DriverSchedule = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_trip_view')
        .select('*')
        .in('status', ['planned', 'in_progress'])
        .order('planned_departure', { ascending: true });

      if (error) throw error;
      setScheduleItems(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (items: ScheduleItem[]) => {
    const grouped = items.reduce((acc, item) => {
      const date = new Date(item.planned_departure).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, ScheduleItem[]>);

    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DriverLayout>
    );
  }

  const today = new Date().toDateString();
  const groupedSchedule = groupByDate(scheduleItems);

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              My Schedule
            </h1>
            <p className="text-muted-foreground">Your upcoming trips and assignments</p>
          </div>
        </div>

        {groupedSchedule.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
              <p className="text-muted-foreground">Your schedule is clear. Check back later for new assignments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedSchedule.map(([date, items]) => (
              <Card key={date} className={date === today ? "border-blue-500 bg-blue-50/50" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {date === today && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">Today</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{items.length} trip(s) scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{item.trip_number}</h4>
                            <Badge variant={item.status === 'in_progress' ? 'default' : 'secondary'}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{item.origin} → {item.destination}</span>
                            </div>
                            {item.truck_number && (
                              <div className="flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                <span>{item.truck_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(item.planned_departure).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Departure Time
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Today's Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="w-5 h-5" />
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {groupedSchedule.find(([date]) => date === today)?.[1]?.length || 0}
                </p>
                <p className="text-sm text-blue-700">Trips Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {scheduleItems.filter(item => item.status === 'planned').length}
                </p>
                <p className="text-sm text-orange-700">Planned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {scheduleItems.filter(item => item.status === 'in_progress').length}
                </p>
                <p className="text-sm text-green-700">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {scheduleItems.length}
                </p>
                <p className="text-sm text-purple-700">Total Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
};

export default DriverSchedule;
