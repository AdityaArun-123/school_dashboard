package com.demo.jwt.authify.services;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.TeacherEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.TeacherRequest;
import com.demo.jwt.authify.repository.TeacherRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    @PersistenceContext
    private final EntityManager entityManager;
    private final TeacherRepository teacherRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addTeacher(TeacherRequest teacherRequest, MultipartFile file) {
        TeacherEntity teacher = convertToTeacherEntity(teacherRequest);
        String imageUrl = uploadTeacherImage(file, null);
        teacher.setTeacherImageUrl(imageUrl);
        teacherRepository.save(teacher);
    }

    @Override
    public Page<TeacherEntity> getAllTeachers(int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TeacherEntity> query = cb.createQuery(TeacherEntity.class);
        Root<TeacherEntity> teacher = query.from(TeacherEntity.class);

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(teacher.get(sortBy)));
        } else {
            query.orderBy(cb.desc(teacher.get(sortBy)));
        }

        List<TeacherEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(TeacherEntity.class)));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Optional<TeacherEntity> getTeacher(Long id) {
        return teacherRepository.findById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeacher(TeacherRequest teacherRequest, MultipartFile file, Long id) {
        TeacherEntity existingTeacher = teacherRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.TeacherNotFoundException(ErrorMessages.TEACHER_NOT_FOUND));

        BeanUtils.copyProperties(teacherRequest, existingTeacher, "teacherId", "createdAt", "updatedAt", "teacherImageUrl");
        String newImageUrl = uploadTeacherImage(file, existingTeacher.getTeacherImageUrl());
        existingTeacher.setTeacherImageUrl(newImageUrl);
        teacherRepository.save(existingTeacher);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTeacher(Long id) {
        teacherRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.TeacherNotFoundException(ErrorMessages.TEACHER_NOT_FOUND));
        teacherRepository.deleteById(id);
    }

    @Override
    public Page<TeacherEntity> searchTeachers(Long teacherId, String name, String classTeacherOf, String phoneNumber, String salary, int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TeacherEntity> query = cb.createQuery(TeacherEntity.class);
        Root<TeacherEntity> teacher = query.from(TeacherEntity.class);

        List<Predicate> predicates = buildPredicates(cb, teacher, teacherId, name, classTeacherOf, phoneNumber, salary);
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(teacher.get(sortBy)));
        } else {
            query.orderBy(cb.desc(teacher.get(sortBy)));
        }

        List<TeacherEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<TeacherEntity> countRoot = countQuery.from(TeacherEntity.class);

        List<Predicate> countPredicates = buildPredicates(cb, countRoot, teacherId, name, classTeacherOf, phoneNumber, salary);

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<TeacherEntity> root,
                                            Long teacherId, String name, String classTeacherOf, String phoneNumber, String salary) {
        List<Predicate> predicates = new ArrayList<>();

        if (teacherId != null) {
            predicates.add(cb.equal(root.get("teacherId"), teacherId));
        }
        if (name != null && !name.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (classTeacherOf != null && !classTeacherOf.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("classTeacherOf")), "%" + classTeacherOf.toLowerCase() + "%"));
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("phoneNumber")), "%" + phoneNumber.toLowerCase() + "%"));
        }
        if (salary != null && !salary.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("salary")), "%" + salary.toLowerCase() + "%"));
        }
        return predicates;
    }

    private String uploadTeacherImage(MultipartFile file, String oldImageUrlIfAny) {
        if (file == null || file.isEmpty()) {
            return oldImageUrlIfAny;
        }
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new AppExceptions.InvalidImageFileException(ErrorMessages.NOT_IMAGE_FILE);
            }
            if (oldImageUrlIfAny != null && !oldImageUrlIfAny.isBlank()) {
                Path oldFilePath = Paths.get("uploads", "teacher_photos", Paths.get(oldImageUrlIfAny).getFileName().toString());
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException ex) {
                    System.err.println("⚠️ Failed to delete old image: " + ex.getMessage());
                }
            }
            String uploadPath = "uploads/teacher_photos/";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String originalFileName = Optional.ofNullable(file.getOriginalFilename())
                    .orElseThrow(() -> new AppExceptions.InvalidFileException(ErrorMessages.MISSING_IMAGE_NAME))
                    .replaceAll("\\s+", "_");

            String filename = UUID.randomUUID() + "_" + originalFileName;
            Path filepath = Paths.get(uploadPath, filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/teacher_photos/" + filename;
        } catch (IOException e) {
            throw new AppExceptions.ImageUploadFailureException(ErrorMessages.IMAGE_UPLOAD_FAILURE);
        }
    }

    private TeacherEntity convertToTeacherEntity(TeacherRequest teacherRequest) {
        return TeacherEntity.builder()
                .name(teacherRequest.getName())
                .email(teacherRequest.getEmail())
                .dateOfBirth(teacherRequest.getDateOfBirth())
                .gender(teacherRequest.getGender())
                .phoneNumber(teacherRequest.getPhoneNumber())
                .address(teacherRequest.getAddress())
                .classTeacherOf(teacherRequest.getClassTeacherOf())
                .religion(teacherRequest.getReligion())
                .bloodGroup(teacherRequest.getBloodGroup())
                .salary(teacherRequest.getSalary())
                .teacherImageUrl(null)
                .build();
    }
}
