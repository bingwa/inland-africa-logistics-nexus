
import { DriverLayout } from "@/components/DriverLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, Square, AlertCircle, Calendar } from "lucide-react";
import { useState } from "react";

const DriverHours = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [currentSession, setCurrentSession] = useState("00:00:00");

  const hoursLog = [
    { date: "2024-07-02", onDuty: "08:00", offDuty: "16:30", totalHours: "8.5", status: "Compliant" },
    { date: "2024-07-01", onDuty: "07:30", offDuty: "17:00", totalHours: "9.5", status: "Compliant" },
    { date: "2024-06-30", onDuty: "08:15", offDuty: "16:45", totalHours: "8.5", status: "Compliant" },
    { date: "2024-06-29", onDuty: "07:00", offDuty: "18:00", totalHours: "11.0", status: "Warning" },
  ];

  const toggleDutyStatus = () => {
    setIsOnDuty(!isOnDuty);
  };

  return (
    <DriverLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Hours of Service Log
            </h1>
            <p className="text-muted-foreground">Track your driving hours and compliance status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isOnDuty ? 'bg-green-100 border-4 border-green-500' : 'bg-gray-100 border-4 border-gray-300'
                }`}>
                  {isOnDuty ? (
                    <Play className="w-8 h-8 text-green-600" />
                  ) : (
                    <Pause className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <Badge className={isOnDuty ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {isOnDuty ? "ON DUTY" : "OFF DUTY"}
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{currentSession}</p>
                <p className="text-sm text-muted-foreground">Current Session</p>
              </div>

              <Button 
                onClick={toggleDutyStatus}
                className={`w-full ${isOnDuty ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isOnDuty ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Go Off Duty
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Go On Duty
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Summary
              </CardTitle>
              <CardDescription>Current week hours and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">37.5</p>
                  <p className="text-sm text-blue-700">Hours This Week</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">32.5</p>
                  <p className="text-sm text-green-700">Driving Hours</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">5.0</p>
                  <p className="text-sm text-orange-700">Rest Hours</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">12.5</p>
                  <p className="text-sm text-purple-700">Hours Remaining</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Compliance Status: GOOD</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You are within legal driving hour limits for this week.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hours Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Hours Log</CardTitle>
            <CardDescription>Your driving hours for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hoursLog.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-medium">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">On Duty:</span>
                        <p className="font-medium">{log.onDuty}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Off Duty:</span>
                        <p className="font-medium">{log.offDuty}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <p className="font-medium">{log.totalHours}h</p>
                      </div>
                    </div>
                  </div>
                  <Badge className={
                    log.status === 'Compliant' 
                      ? "bg-green-100 text-green-800 border-green-300" 
                      : "bg-orange-100 text-orange-800 border-orange-300"
                  }>
                    {log.status === 'Warning' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  );
};

export default DriverHours;
