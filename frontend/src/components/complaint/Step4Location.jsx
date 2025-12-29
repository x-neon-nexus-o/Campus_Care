import React from 'react';
import { useFormContext } from 'react-hook-form';

const buildings = ['Main', 'Library', 'Hostel', 'Workshop'];
const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electrical', 'Admin'];

const Step4Location = () => {
    const { register } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Location Details (Optional)</h3>
                <p className="text-sm text-gray-500">Help us locate the issue more precisely</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="label"><span className="label-text">Building</span></label>
                    <select className="w-full select select-bordered" {...register('building')}>
                        <option value="">Select Building</option>
                        {buildings.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label"><span className="label-text">Block/Wing</span></label>
                    <input
                        className="w-full input input-bordered"
                        placeholder="e.g., A Block"
                        {...register('block')}
                    />
                </div>

                <div>
                    <label className="label"><span className="label-text">Room/Location</span></label>
                    <input
                        className="w-full input input-bordered"
                        placeholder="e.g., Room 101"
                        {...register('room')}
                    />
                </div>

                <div>
                    <label className="label"><span className="label-text">Department</span></label>
                    <select className="w-full select select-bordered" {...register('department')}>
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Step4Location;
