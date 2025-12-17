import { CustomButton } from '@/components/ui/CustomButton';
import { HomeProject } from '@/types/cms';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ProjectsSection = ({ projects }: { projects: HomeProject[] }) => (
    <section className="bg-white py-20 text-center">
        <div className="container mx-auto px-4">
            <h2 className="mb-4 text-4xl font-bold text-[#006838]">
                E-Club's Projects
            </h2>
            <p className="mb-12 text-gray-600">
                Discover real-world applications of entrepreneurial ideas.
            </p>

            {projects && projects.length > 0 ? (
                <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            whileHover={{ scale: 1.02 }}
                            className={`flex h-40 flex-col items-center justify-center rounded-2xl border p-6 transition-shadow ${project.color ? '' : 'bg-gray-50'}`}
                        >
                            <h3
                                className={`text-xl font-bold md:text-2xl ${project.color || 'text-gray-800'} text-center font-serif`}
                            >
                                {project.title}
                            </h3>
                            {project.subtitle && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {project.subtitle}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="mb-12 text-gray-500 italic">No projects found.</p>
            )}

            <CustomButton className="h-12 rounded-full px-8 text-base">
                More Projects <ArrowRight className="ml-2 h-4 w-4" />
            </CustomButton>
        </div>
    </section>
);
