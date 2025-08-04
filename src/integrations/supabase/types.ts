export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      driver_trip_assignments: {
        Row: {
          assigned_at: string | null
          driver_id: string | null
          id: string
          status: string | null
          trip_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          trip_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_trip_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_trip_assignments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "driver_trip_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_trip_assignments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          compliance_score: number | null
          created_at: string | null
          email: string | null
          employee_id: string
          full_name: string
          hire_date: string
          hours_of_service_today: number | null
          id: string
          license_expiry: string
          license_number: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          compliance_score?: number | null
          created_at?: string | null
          email?: string | null
          employee_id: string
          full_name: string
          hire_date: string
          hours_of_service_today?: number | null
          id?: string
          license_expiry: string
          license_number: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          compliance_score?: number | null
          created_at?: string | null
          email?: string | null
          employee_id?: string
          full_name?: string
          hire_date?: string
          hours_of_service_today?: number | null
          id?: string
          license_expiry?: string
          license_number?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fuel_records: {
        Row: {
          carbon_offset_kg: number | null
          cost_per_liter: number
          created_at: string | null
          driver_id: string | null
          fuel_date: string
          fuel_station: string | null
          id: string
          liters: number
          odometer_reading: number | null
          payment_method: string | null
          receipt_number: string | null
          total_cost: number
          trip_id: string | null
          truck_id: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_offset_kg?: number | null
          cost_per_liter: number
          created_at?: string | null
          driver_id?: string | null
          fuel_date: string
          fuel_station?: string | null
          id?: string
          liters: number
          odometer_reading?: number | null
          payment_method?: string | null
          receipt_number?: string | null
          total_cost: number
          trip_id?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_offset_kg?: number | null
          cost_per_liter?: number
          created_at?: string | null
          driver_id?: string | null
          fuel_date?: string
          fuel_station?: string | null
          id?: string
          liters?: number
          odometer_reading?: number | null
          payment_method?: string | null
          receipt_number?: string | null
          total_cost?: number
          trip_id?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "driver_trip_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          cost: number
          created_at: string | null
          description: string
          downtime_hours: number | null
          id: string
          items_purchased: string | null
          maintenance_type: string
          mileage_at_service: number | null
          next_service_date: string | null
          service_date: string
          service_provider: string | null
          status: string | null
          technician: string | null
          truck_id: string | null
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string | null
          description: string
          downtime_hours?: number | null
          id?: string
          items_purchased?: string | null
          maintenance_type: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          service_date: string
          service_provider?: string | null
          status?: string | null
          technician?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string | null
          description?: string
          downtime_hours?: number | null
          id?: string
          items_purchased?: string | null
          maintenance_type?: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          service_date?: string
          service_provider?: string | null
          status?: string | null
          technician?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          department: string | null
          email_notifications: boolean | null
          emergency_contact: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          join_date: string | null
          license_number: string | null
          location: string | null
          phone: string | null
          push_notifications: boolean | null
          role: string | null
          sms_notifications: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          department?: string | null
          email_notifications?: boolean | null
          emergency_contact?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          join_date?: string | null
          license_number?: string | null
          location?: string | null
          phone?: string | null
          push_notifications?: boolean | null
          role?: string | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          department?: string | null
          email_notifications?: boolean | null
          emergency_contact?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          join_date?: string | null
          license_number?: string | null
          location?: string | null
          phone?: string | null
          push_notifications?: boolean | null
          role?: string | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      spare_parts: {
        Row: {
          created_at: string | null
          id: string
          installation_date: string | null
          maintenance_id: string | null
          part_category: string | null
          part_name: string
          part_number: string | null
          quantity: number
          supplier: string | null
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
          warranty_months: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          maintenance_id?: string | null
          part_category?: string | null
          part_name: string
          part_number?: string | null
          quantity?: number
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          warranty_months?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          maintenance_id?: string | null
          part_category?: string | null
          part_name?: string
          part_number?: string | null
          quantity?: number
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spare_parts_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          actual_arrival: string | null
          actual_departure: string | null
          cargo_value_usd: number | null
          created_at: string | null
          customer_contact: string | null
          destination: string
          distance_km: number | null
          driver_id: string | null
          estimated_wear_tear_ksh: number | null
          fuel_cost: number | null
          id: string
          notes: string | null
          origin: string
          other_expenses: number | null
          planned_arrival: string
          planned_departure: string
          status: string | null
          toll_cost: number | null
          trip_number: string
          truck_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          actual_departure?: string | null
          cargo_value_usd?: number | null
          created_at?: string | null
          customer_contact?: string | null
          destination: string
          distance_km?: number | null
          driver_id?: string | null
          estimated_wear_tear_ksh?: number | null
          fuel_cost?: number | null
          id?: string
          notes?: string | null
          origin: string
          other_expenses?: number | null
          planned_arrival: string
          planned_departure: string
          status?: string | null
          toll_cost?: number | null
          trip_number: string
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          actual_departure?: string | null
          cargo_value_usd?: number | null
          created_at?: string | null
          customer_contact?: string | null
          destination?: string
          distance_km?: number | null
          driver_id?: string | null
          estimated_wear_tear_ksh?: number | null
          fuel_cost?: number | null
          id?: string
          notes?: string | null
          origin?: string
          other_expenses?: number | null
          planned_arrival?: string
          planned_departure?: string
          status?: string | null
          toll_cost?: number | null
          trip_number?: string
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          expiry_date: string | null
          file_path: string
          file_size: number | null
          id: string
          is_active: boolean
          mime_type: string | null
          truck_id: string
          updated_at: string
          upload_date: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          expiry_date?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          mime_type?: string | null
          truck_id: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          mime_type?: string | null
          truck_id?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_documents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          capacity_tons: number
          created_at: string | null
          fuel_type: string
          id: string
          insurance_expiry: string | null
          last_gps_lat: number | null
          last_gps_lng: number | null
          last_service_date: string | null
          last_service_mileage: number | null
          license_plate: string
          make: string
          mileage: number | null
          model: string
          next_service_due: string | null
          ntsa_expiry: string | null
          purchase_date: string | null
          status: string | null
          telematics_id: string | null
          tgl_expiry: string | null
          truck_number: string
          updated_at: string | null
          vin: string | null
          year: number
        }
        Insert: {
          capacity_tons: number
          created_at?: string | null
          fuel_type: string
          id?: string
          insurance_expiry?: string | null
          last_gps_lat?: number | null
          last_gps_lng?: number | null
          last_service_date?: string | null
          last_service_mileage?: number | null
          license_plate: string
          make: string
          mileage?: number | null
          model: string
          next_service_due?: string | null
          ntsa_expiry?: string | null
          purchase_date?: string | null
          status?: string | null
          telematics_id?: string | null
          tgl_expiry?: string | null
          truck_number: string
          updated_at?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          capacity_tons?: number
          created_at?: string | null
          fuel_type?: string
          id?: string
          insurance_expiry?: string | null
          last_gps_lat?: number | null
          last_gps_lng?: number | null
          last_service_date?: string | null
          last_service_mileage?: number | null
          license_plate?: string
          make?: string
          mileage?: number | null
          model?: string
          next_service_due?: string | null
          ntsa_expiry?: string | null
          purchase_date?: string | null
          status?: string | null
          telematics_id?: string | null
          tgl_expiry?: string | null
          truck_number?: string
          updated_at?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          password_hash: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          password_hash: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      driver_trip_view: {
        Row: {
          actual_arrival: string | null
          actual_departure: string | null
          assigned_at: string | null
          assignment_status: string | null
          cargo_value_usd: number | null
          created_at: string | null
          customer_contact: string | null
          destination: string | null
          distance_km: number | null
          driver_id: string | null
          estimated_wear_tear_ksh: number | null
          fuel_cost: number | null
          id: string | null
          make: string | null
          model: string | null
          notes: string | null
          origin: string | null
          other_expenses: number | null
          planned_arrival: string | null
          planned_departure: string | null
          status: string | null
          toll_cost: number | null
          trip_number: string | null
          truck_id: string | null
          truck_number: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_manager_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          _action: string
          _table_name?: string
          _record_id?: string
          _old_values?: Json
          _new_values?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "driver" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "driver", "user"],
    },
  },
} as const
