"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, Navigation, Gauge } from "lucide-react";

interface WaypointInputProps {
  onAdd: (waypoint: {
    name: string;
    coordinates: {
      lat?: number;
      lng?: number;
      mgrs?: string;
    };
    speed: {
      value: number;
      unit: "kt" | "kmh";
    };
  }) => void;
  coordinateSystem: "latLng" | "mgrs";
  onCoordinateSystemChange: (system: "latLng" | "mgrs") => void;
}

const createFormSchema = (coordinateSystem: "latLng" | "mgrs") => z.object({
  name: z.string().min(1, "웨이포인트 이름을 입력해주세요"),
  coordinates: z.object({
    lat: z.number().optional()
      .refine(val => coordinateSystem !== "latLng" || (val !== undefined && val >= -90 && val <= 90), 
        "위도는 -90도에서 90도 사이여야 합니다"),
    lng: z.number().optional()
      .refine(val => coordinateSystem !== "latLng" || (val !== undefined && val >= -180 && val <= 180), 
        "경도는 -180도에서 180도 사이여야 합니다"),
    mgrs: z.string().optional()
      .refine(val => coordinateSystem !== "mgrs" || (val !== undefined && /^[0-9]{2}[A-Z]{3}[0-9]{10}$/.test(val)), 
        "올바른 MGRS 형식이 아닙니다"),
  }),
  speed: z.object({
    value: z.number().min(0, "속도는 0보다 커야 합니다"),
    unit: z.enum(["kt", "kmh"]),
  }),
});

export function WaypointInput({ onAdd, coordinateSystem, onCoordinateSystemChange }: WaypointInputProps) {
  const formSchema = createFormSchema(coordinateSystem);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      coordinates: {},
      speed: {
        value: 0,
        unit: "kt",
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const waypoint = {
      name: data.name,
      coordinates: coordinateSystem === "latLng"
        ? {
            lat: Number(data.coordinates.lat),
            lng: Number(data.coordinates.lng),
          }
        : {
            mgrs: data.coordinates.mgrs,
          },
      speed: {
        value: Number(data.speed.value),
        unit: data.speed.unit,
      },
    };

    console.log("Submitting waypoint:", waypoint);
    onAdd(waypoint);
    
    form.reset({
      name: "",
      coordinates: {},
      speed: {
        value: 0,
        unit: "kt",
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  웨이포인트 이름
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: RKPC" className="bg-white dark:bg-gray-800" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-sky-500" />
              좌표 시스템
            </FormLabel>
            <Select
              value={coordinateSystem}
              onValueChange={(value: "latLng" | "mgrs") => onCoordinateSystemChange(value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latLng">위도/경도</SelectItem>
                <SelectItem value="mgrs">MGRS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 bg-sky-50 dark:bg-gray-800/50 rounded-lg">
          {coordinateSystem === "latLng" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="coordinates.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>위도</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        placeholder="예: 37.5665"
                        className="bg-white dark:bg-gray-800"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coordinates.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경도</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        placeholder="예: 126.9780"
                        className="bg-white dark:bg-gray-800"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="coordinates.mgrs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MGRS 좌표</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="예: 52SCJ1234567890" 
                      className="bg-white dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-end">
          <FormField
            control={form.control}
            name="speed.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-sky-500" />
                  속도
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="속도 입력"
                    className="bg-white dark:bg-gray-800"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="speed.unit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kt">kt</SelectItem>
                      <SelectItem value="kmh">km/h</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
          웨이포인트 추가
        </Button>
      </form>
    </Form>
  );
} 